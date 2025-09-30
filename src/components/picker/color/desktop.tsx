'use client';

import { ColorPickerInternalProps, ColorPickerPointer, ColorPickerPreview } from '@/components/picker';
import { SlotRootProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { borderAndBoxShadow } from '@lunaproject/web-core/dist/utils';
import { SlotComponentProps } from '@mui/base';
import { Box, Grow, Popper, styled, Tab, Tabs, tabsClasses, Theme, useTheme } from '@mui/material';
import { Alpha, hsvaToHex, hsvaToRgbaString, Hue, Saturation } from '@uiw/react-color';
import React, { Fragment } from 'react';

export const DesktopColorPickerContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
}));

export interface DesktopColorPickerSlotProps {
    slotProps?: {
        root?: SlotComponentProps<typeof Popper, SlotRootProps, {}>;
        content?: SlotComponentProps<typeof Box, SlotRootProps, {}>;
    };
}

export type DesktopColorPickerProps = ColorPickerInternalProps & DesktopColorPickerSlotProps;

export const DesktopColorPicker = (
    {
        anchorEl,
        setAnchorEl,
        choices,
        disableAlpha,
        tabState,
        setTabState,
        hsva,
        onHsvaSaturationChange,
        onHsvaHueChange,
        onHsvaAlphaChange,
        slotProps: {
            root: rootProps,
            content: contentProps
        } = {}
    }: DesktopColorPickerProps
) => {
    const theme = useTheme();

    return (
        <Popper
            open={anchorEl !== undefined}
            anchorEl={anchorEl}
            placement="bottom"
            transition
            {...rootProps}
        >
            {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                    <Box
                        sx={(theme: Theme) => ({
                            width: 300,
                            overflow: 'hidden',
                            transformOrigin: 'top center',
                            bgcolor: theme.vars.palette.background.paper,
                            backgroundImage: 'none',
                            borderRadius: 1,
                            ...borderAndBoxShadow(theme),
                            ...theme.applyStyles('dark', {
                                backgroundImage: theme.vars.overlays[8]
                            })
                        })}
                        {...contentProps}
                    >
                        <Tabs
                            value={tabState}
                            onChange={(_, newValue) => setTabState(newValue)}
                            variant="fullWidth"
                            sx={{
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
                        {tabState === 'custom' ? <Fragment>
                            <DesktopColorPickerContent>
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
                            </DesktopColorPickerContent>
                        </Fragment> : <Fragment />}
                    </Box>
                </Grow>
            )}
        </Popper>
    );
};
