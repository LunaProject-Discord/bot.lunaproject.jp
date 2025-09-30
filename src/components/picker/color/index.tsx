'use client';

import { DesktopColorPicker, MobileColorPicker } from '@/components/picker';
import {
    DesktopPickerSlotProps,
    MobilePickerSlotProps,
    PickerBaseProps
} from '@lunaproject/web-core/dist/components/Picker';
import { SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { Portal } from '@mui/base';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ColorResult } from '@uiw/color-convert';
import {
    Alpha,
    AlphaProps,
    color,
    hexToHsva,
    HsvaColor,
    hsvaToHex,
    hsvaToHexa,
    hsvaToRgbaString,
    HueProps,
    PointerProps,
    SaturationProps,
    validHex
} from '@uiw/react-color';
import React, { CSSProperties, Fragment, useCallback, useEffect, useMemo, useState } from 'react';

export const defaultHsvaColor: HsvaColor = {
    h: 0,
    s: 0,
    v: 0,
    a: 1
};

export const ColorPickerPointer = (
    color: string,
    styles: (props: PointerProps) => CSSProperties = () => ({}),
    portal: boolean = false
    // eslint-disable-next-line react/display-name
) => (props: PointerProps) => {
    const { top, left } = props;

    const children = (
        <Box
            sx={(theme) => ({
                width: theme.spacing(2),
                height: theme.spacing(2),
                position: 'absolute',
                top: top || 0,
                bottom: 0,
                left: left || 0,
                bgcolor: color,
                borderRadius: '50%',
                boxShadow: 'rgb(255 255 255) 0 0 0 1.5px, rgb(0 0 0 / .3) 0 0 1px 1px inset, rgb(0 0 0 / .4) 0 0 1px 2px',
                ...styles(props)
            })}
        />
    );

    if (!portal)
        return children;

    return (
        <Portal>
            {children}
        </Portal>
    );
};

export interface ColorPickerPreviewProps {
    hsva: HsvaColor;
    width?: CSSProperties['width'];
    height?: CSSProperties['height'];
}

export const ColorPickerPreview = ({ hsva, width, height }: ColorPickerPreviewProps) => {
    const theme = useTheme();

    const setTabIndex = useCallback((element: HTMLDivElement | null) => {
        if (!element)
            return;

        element.tabIndex = -1;
        for (const child of element.children)
            if (child instanceof HTMLElement && child.getAttribute('tabindex') !== null)
                child.tabIndex = -1;
    }, []);

    return (
        <Alpha
            ref={setTabIndex}
            hsva={hsva}
            pointer={() => (<Fragment />)}
            width={width ?? theme.spacing(3)}
            height={height ?? theme.spacing(3)}
            radius="50%"
            style={{
                flexShrink: 0
            }}
            bgProps={{
                style: {
                    background: 'transparent'
                }
            }}
            innerProps={{
                style: {
                    background: hsvaToRgbaString(hsva),
                    borderRadius: '50%',
                    boxShadow: 'rgb(0 0 0 / .25) 0px 0px 1px inset'
                }
            }}
        />
    );
};

export type ColorPickerChangeHandler = (color: ColorResult) => void;

export interface ColorPickerRootProps extends PickerBaseProps {
    value?: string | HsvaColor;
    onChange?: ColorPickerChangeHandler;
    choices?: string[];
    disableAlpha?: boolean;
}

export interface ColorPickerSlotProps {
    slotProps?: {
        desktop?: DesktopPickerSlotProps['slotProps'];
        mobile?: MobilePickerSlotProps['slotProps'];
    };
}

export type ColorPickerProps = ColorPickerRootProps & ColorPickerSlotProps;

export type ColorPickerInternalTabState = 'custom' | 'preset';

export type ColorPickerInternalChangeHandler = (color: HsvaColor) => void;

export type ColorPickerInternalSaturationChangeHandler = Exclude<SaturationProps['onChange'], undefined>;

export type ColorPickerInternalHueChangeHandler = Exclude<HueProps['onChange'], undefined>;

export type ColorPickerInternalAlphaChangeHandler = Exclude<AlphaProps['onChange'], undefined>;

export interface ColorPickerInternalProps extends Omit<ColorPickerRootProps, 'value' | 'onChange'>, SectionCardVariableProps<{
    tabState: ColorPickerInternalTabState;
    inputValue: string;
    inputFocused: boolean;
}> {
    hsva: HsvaColor;
    onChange: ColorPickerInternalChangeHandler;
    onHsvaSaturationChange: ColorPickerInternalSaturationChangeHandler;
    onHsvaHueChange: ColorPickerInternalHueChangeHandler;
    onHsvaAlphaChange: ColorPickerInternalAlphaChangeHandler;
}

export const ColorPicker = (
    {
        value,
        onChange,
        disableAlpha,
        slotProps: {
            desktop: desktopProps,
            mobile: mobileProps
        } = {},
        ...props
    }: ColorPickerProps
) => {
    const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    const hsva = useMemo(() => {
        if (!value)
            return defaultHsvaColor;

        if (typeof value !== 'string')
            return value;

        if (!validHex(value))
            return defaultHsvaColor;

        return hexToHsva(value);
    }, [value]);

    const convert = useCallback((color: HsvaColor) => !disableAlpha && hsva.a < 1 ? hsvaToHexa(color) : hsvaToHex(color), [disableAlpha, hsva.a]);

    const [tabState, setTabState] = useState<'custom' | 'preset'>('custom');
    const [inputValue, setInputValue] = useState(convert(hsva));
    const [inputFocused, setInputFocused] = useState(false);

    const handleChange = useCallback((hsva: HsvaColor) => {
        if (onChange)
            onChange(color(hsva));
    }, [onChange]);

    const handleHsvaSaturationChange: ColorPickerInternalSaturationChangeHandler = useCallback((newColor) => handleChange({ ...hsva, ...newColor }), [handleChange, hsva]);

    const handleHsvaHueChange: ColorPickerInternalHueChangeHandler = useCallback((newHue) => handleChange({ ...hsva, ...newHue }), [handleChange, hsva]);

    const handleHsvaAlphaChange: ColorPickerInternalAlphaChangeHandler = useCallback((newAlpha) => handleChange({ ...hsva, ...newAlpha }), [handleChange, hsva]);

    const pickerProps = {
        disableAlpha,
        tabState,
        setTabState,
        hsva,
        inputValue,
        setInputValue,
        inputFocused,
        setInputFocused,
        onChange: handleChange,
        onHsvaSaturationChange: handleHsvaSaturationChange,
        onHsvaHueChange: handleHsvaHueChange,
        onHsvaAlphaChange: handleHsvaAlphaChange
    };

    useEffect(() => {
        if (inputFocused)
            return;

        setInputValue(convert(hsva));
    }, [convert, disableAlpha, hsva, inputFocused]);

    if (isSmall) {
        return (
            <DesktopColorPicker
                slotProps={desktopProps}
                {...pickerProps}
                {...props}
            />
        );
    } else {
        return (
            <MobileColorPicker
                slotProps={mobileProps}
                {...pickerProps}
                {...props}
            />
        );
    }
};

export * from './desktop';
export * from './mobile';
