'use client';

import {
    ColorPickerInternalProps,
    ColorPickerPointer,
    ColorPickerPreview,
    MobilePickerRoot
} from '@/components/picker';
import { BottomSheet, BottomSheetContent } from '@lunaproject/web-core/dist/components/BottomSheet';
import { SlotRootProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { SlotComponentProps } from '@mui/base';
import { Box, BoxProps, OutlinedInput, Tab, Tabs, tabsClasses, useTheme } from '@mui/material';
import { Alpha, hexToHsva, hsvaToHex, hsvaToRgbaString, Hue, Saturation, validHex } from '@uiw/react-color';
import React, { Fragment } from 'react';

export interface MobileColorPickerSlotProps {
    slotProps?: {
        root?: SlotComponentProps<typeof BottomSheet, SlotRootProps, {}>;
        content?: SlotComponentProps<typeof Box, BoxProps, {}>;
    };
}

export type MobileColorPickerProps = ColorPickerInternalProps & MobileColorPickerSlotProps;

export const MobileColorPicker = (
    {
        anchorEl,
        setAnchorEl,
        choices,
        disableAlpha,
        tabState,
        setTabState,
        hsva,
        inputValue,
        setInputValue,
        setInputFocused,
        onChange,
        onHsvaSaturationChange,
        onHsvaHueChange,
        onHsvaAlphaChange,
        slotProps: {
            root: rootProps,
            content: contentProps
        } = {}
    }: MobileColorPickerProps
) => {
    const theme = useTheme();

    return (
        <MobilePickerRoot
            open={anchorEl !== undefined}
            onDismiss={() => setAnchorEl(undefined)}
            // expandOnContentDrag
            // defaultSnap={getMobilePickerDefaultSnap}
            // snapPoints={getMobilePickerSnapPoints}
            initialFocusRef={false}
            header={
                <Tabs
                    value={tabState}
                    onChange={(_, newValue) => setTabState(newValue)}
                    variant="fullWidth"
                    sx={{
                        height: (theme) => theme.spacing(6.5),
                        margin: (theme) => theme.spacing(0, -2),
                        [`& .${tabsClasses.flexContainer}`]: {
                            gap: 0
                        }
                    }}
                >
                    <Tab
                        value="custom"
                        label="カスタム"
                    />
                    <Tab
                        value="preset"
                        label="プリセット"
                    />
                </Tabs>
            }
            sx={{
                '&[data-rsbs-has-header="true"] [data-rsbs-header]:not(#_)': {
                    boxShadow: 'none'
                },
                '& [data-rsbs-scroll]': {
                    overflow: 'hidden'
                }
            }}
            {...rootProps}
        >
            {tabState === 'custom' ? <Fragment>
                <BottomSheetContent>
                    <Saturation
                        hsva={hsva}
                        onChange={onHsvaSaturationChange}
                        pointer={
                            ColorPickerPointer(
                                hsvaToHex(hsva),
                                () => ({ margin: theme.spacing(-1, 0, 0, -1) })
                            )
                        }
                        radius={theme.shape.borderRadius}
                        style={{
                            width: '100%',
                            height: 'unset',
                            aspectRatio: '1'
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <ColorPickerPreview hsva={hsva} />
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                            <Hue
                                hue={hsva.h}
                                onChange={onHsvaHueChange}
                                pointer={ColorPickerPointer(`hsl(${hsva?.h || 0}deg 100% 50%)`)}
                                height={theme.spacing(2)}
                                radius={theme.spacing(2)}
                                innerProps={{
                                    style: {
                                        marginRight: theme.spacing(2)
                                    }
                                }}
                            />
                            {!disableAlpha && <Alpha
                                hsva={hsva}
                                onChange={onHsvaAlphaChange}
                                pointer={ColorPickerPointer(hsvaToRgbaString(hsva))}
                                height={theme.spacing(2)}
                                radius={theme.spacing(2)}
                                innerProps={{
                                    style: {
                                        marginRight: theme.spacing(2)
                                    }
                                }}
                            />}
                        </Box>
                    </Box>
                    <OutlinedInput
                        value={inputValue}
                        onChange={(e) => {
                            const value = e.currentTarget.value;
                            setInputValue(value);

                            if (validHex(value))
                                onChange(hexToHsva(value));
                        }}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        size="small"
                        margin="none"
                    />
                </BottomSheetContent>
            </Fragment> : <Fragment />}
        </MobilePickerRoot>
    );
};
