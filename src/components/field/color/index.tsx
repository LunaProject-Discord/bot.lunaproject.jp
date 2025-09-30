'use client';

import { ColorPicker, ColorPickerChangeHandler, ColorPickerPreview, ColorPickerProps } from '@/components/picker';
import { LocalizationProps } from '@/interfaces/localization';
import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { ClickAwayListener } from '@mui/base';
import { Box, InputAdornment, OutlinedInput, OutlinedInputProps, useTheme } from '@mui/material';
import { hexToHsva, HsvaColor, hsvaToHex, hsvaToHexa, validHex } from '@uiw/react-color';
import React, { ChangeEvent, FocusEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';

export interface ColorFieldRootProps extends SectionCardVariableProps<{
    value: HsvaColor;
}>, SectionCardDisabledProps, LocalizationProps {
    choices?: string[];
    disableAlpha?: boolean;
}

export interface ColorFieldSlotProps {
    slotProps?: {
        input?: OutlinedInputProps;
        picker?: ColorPickerProps['slotProps'];
    };
}

export type ColorFieldProps = ColorFieldRootProps & ColorFieldSlotProps;

export const ColorField = (
    {
        value,
        setValue,
        disabled,
        disableAlpha,
        choices,
        slotProps: {
            input: inputProps,
            picker: pickerProps
        } = {},
        localization
    }: ColorFieldProps
) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);
    const [containerElement, _setContainerElement] = useState<HTMLDivElement | null>(null);

    const [inputValue, setInputValue] = useState(!disableAlpha && value.a < 1 ? hsvaToHexa(value) : hsvaToHex(value));
    const [inputFocused, setInputFocused] = useState(false);

    const setContainerElement = useCallback(_setContainerElement, [_setContainerElement]);

    const updateInputValue = useCallback(() => setInputValue(!disableAlpha && value.a < 1 ? hsvaToHexa(value) : hsvaToHex(value)), [disableAlpha, value]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setInputValue(value);

        if (validHex(value))
            setValue(hexToHsva(value));
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || (e.key !== 'Enter' && e.key !== 'Tab'))
            return;

        updateInputValue();

        if (e.key === 'Tab')
            setAnchorEl(undefined);
    };

    const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
        setInputFocused(true);

        if (containerElement)
            setAnchorEl(containerElement);
    };

    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
        setInputFocused(false);

        updateInputValue();
    };

    const handleColorPickerChange: ColorPickerChangeHandler = (color) => setValue(color.hsva);

    useEffect(() => {
        if (inputFocused)
            return;

        updateInputValue();
    }, [disableAlpha, inputFocused, updateInputValue, value]);

    return (
        <ClickAwayListener onClickAway={() => setAnchorEl(undefined)}>
            <Box sx={{ width: '100%' }}>
                <Box ref={setContainerElement}>
                    <OutlinedInput
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        disabled={disabled}
                        size="small"
                        margin="none"
                        startAdornment={
                            <InputAdornment position="start">
                                <ColorPickerPreview
                                    hsva={value}
                                    width={theme.spacing(2)}
                                    height={theme.spacing(2)}
                                />
                            </InputAdornment>
                        }
                        {...inputProps}
                    />
                </Box>

                <ColorPicker
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    value={value}
                    onChange={handleColorPickerChange}
                    choices={choices}
                    disableAlpha={disableAlpha}
                    slotProps={pickerProps}
                />
            </Box>
        </ClickAwayListener>
    );
};
