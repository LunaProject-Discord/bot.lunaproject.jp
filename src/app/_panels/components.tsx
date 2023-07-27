'use client';

import { fontFamily } from '@app/theme';
import { LocalizationProps } from '@interfaces/localization';
import { getMuiDateLocalizationByName, getMuiLocalizationByName } from '@localizations/index';
import { ButtonBase } from '@lunaproject-discord/web-core/dist/components/ButtonBase';
import { MuiPalette } from '@lunaproject-discord/web-core/dist/utils/theme';
import { Box, createTheme, Drawer, drawerClasses, styled, SwipeableDrawer, ThemeProvider } from '@mui/material';
import { blueGrey, indigo } from '@mui/material/colors';
import { ReactNode } from 'react';

export interface PanelThemeProviderProps extends LocalizationProps {
    children: ReactNode;
}

export const PanelThemeProvider = ({ children, localization }: PanelThemeProviderProps) => {
    const { locale } = localization;

    const theme = createTheme(
        {
            components: {
                MuiTooltip: {
                    styleOverrides: {
                        popper: {
                            userSelect: 'none'
                        }
                    }
                }
            },
            palette: {
                ...MuiPalette,
                primary: {
                    light: indigo.A200,
                    main: indigo.A400,
                    dark: indigo.A700
                },
                mode: 'dark'
            },
            typography: {
                fontFamily
            }
        },
        getMuiLocalizationByName(locale),
        getMuiDateLocalizationByName(locale)
    );

    return (<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

export const DesktopPanelToggleButton = styled(ButtonBase)(({ theme }) => ({
    padding: theme.spacing(1, .625, 1, 1),
    position: 'fixed',
    bottom: theme.spacing(2),
    right: 0,
    color: theme.palette.action.active,
    backgroundColor: 'inherit',
    border: `solid 1px ${theme.palette.divider}`,
    borderRight: 'none',
    borderRadius: '50% 0 0 50%',
    boxShadow: `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
}));

export const DesktopPanelDrawer = styled(Drawer)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: 'none'
    },
    [`& .${drawerClasses.paper}`]: {
        width: 400
    }
}));

export const MobilePanelDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none'
    },
    [`& .${drawerClasses.paper}`]: {
        maxHeight: '95dvh',
        borderTopLeftRadius: theme.spacing(1.5),
        borderTopRightRadius: theme.spacing(1.5)
    }
}));

export const PanelRoot = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    color: theme.palette.common.white,
    backgroundColor: blueGrey['900']
}));

export const PanelContentRoot = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    overscrollBehavior: 'contain',
    gap: theme.spacing(2)
}));

export const DesktopPanelHeaderRoot = styled('header')(({ theme }) => ({
    height: (8 * 2) * 2 + 42 + 1,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderBottom: `solid 1px ${theme.palette.divider}`
}));

export const MobilePanelHeaderRoot = styled('header')(({ theme }) => ({
    height: theme.spacing(8),
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderBottom: `solid 1px ${theme.palette.divider}`,
    borderTopLeftRadius: theme.spacing(1.5),
    borderTopRightRadius: theme.spacing(1.5)
}));
