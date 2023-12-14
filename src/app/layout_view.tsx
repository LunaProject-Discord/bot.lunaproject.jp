'use client';

import { ErrorIcon, InfoIcon, TaskAltIcon, WarningIcon } from '@components/icons';
import { RootLayout } from '@components/layout_v2';
import { UserFlags } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { StyleProvider } from '@lunaproject/web-core/dist/components/StyleProvider';
import { MuiComponents, MuiDarkTheme, MuiLightTheme, MuiPalette } from '@lunaproject/web-core/dist/utils/theme';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import {
    alertClasses,
    AlertProps,
    buttonClasses,
    createTheme,
    CssBaseline,
    darken,
    GlobalStyles,
    lighten,
    ThemeProvider
} from '@mui/material';
import { indigo } from '@mui/material/colors';
import { appearanceAtom, AppearanceType } from '@states/appearance';
import { COOKIE_APPEARANCE } from '@utils/cookie';
import { parseCookies } from 'nookies';
import { rgba } from 'polished';
import React, { ReactNode, useEffect } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import { getMuiDateLocalizationByName, getMuiGridLocalizationByName, getMuiLocalizationByName } from '../localizations';
import { Navigation } from './_navigation';
import { fontFamily, M_Plus_Rounded_1c, Nunito } from './theme';

interface LayoutProps extends LocalizationProps {
    user: OAuthUser | undefined;
    flags: UserFlags | undefined;
    children: ReactNode;
}

const Layout = ({ user, flags, localization, children }: LayoutProps) => {
    const { locale } = localization;

    const [{ isDarkMode }, setAppearance] = useRecoilState(appearanceAtom);

    const theme = createTheme(
        {
            components: {
                ...MuiComponents,
                MuiAlert: {
                    defaultProps: {
                        iconMapping: {
                            success: <TaskAltIcon fontSize="inherit" />,
                            warning: <WarningIcon fontSize="inherit" />,
                            error: <ErrorIcon fontSize="inherit" />,
                            info: <InfoIcon fontSize="inherit" />
                        }
                    },
                    styleOverrides: {
                        standard: ({ theme, ownerState }) => {
                            const getColor = theme.palette.mode === 'light' ? lighten : darken;
                            const getBackgroundColor = theme.palette.mode === 'light' ? darken : lighten;
                            const color: AlertProps['color'] = ownerState.color || ownerState.severity || 'success';

                            return {
                                [`& .${alertClasses.message} .${buttonClasses.root}.${buttonClasses.containedInherit}`]: {
                                    color: getColor(theme.palette[color].light, .9),
                                    backgroundColor: getBackgroundColor(theme.palette[color].light, .6)
                                }
                            };
                        }
                    }
                },
                MuiButton: {
                    defaultProps: {
                        color: 'monotone'
                    },
                    styleOverrides: {
                        root: {
                            textTransform: 'none'
                        }
                    },
                    variants: [
                        {
                            props: {
                                variant: 'contained',
                                color: 'monotone'
                            },
                            style: ({ theme }) => ({
                                [`&:disabled, &.${buttonClasses.disabled}`]: {
                                    color: theme.palette.mode === 'light' ? rgba(0, 0, 0, .26) : rgba(255, 255, 255, .3),
                                    backgroundColor: theme.palette.mode === 'light' ? rgba(0, 0, 0, .12) : rgba(255, 255, 255, .12)
                                },
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'light' ? rgba(0, 0, 0, .7) : rgba(255, 255, 255, .85)
                                },
                                [`&:active, &.${buttonClasses.focusVisible}`]: {
                                    backgroundColor: theme.palette.mode === 'light' ? rgba(0, 0, 0, .65) : rgba(255, 255, 255, .8)
                                }
                            })
                        }
                    ]
                }
            },
            palette: {
                ...MuiPalette,
                primary: {
                    light: indigo[isDarkMode ? 'A200' : 300],
                    main: indigo[isDarkMode ? 'A400' : 500],
                    dark: indigo[isDarkMode ? 'A700' : 700]
                },
                monotone: {
                    light: MuiLightTheme.palette.text.primary,
                    main: (isDarkMode ? MuiDarkTheme : MuiLightTheme).palette.text.primary,
                    dark: MuiDarkTheme.palette.text.primary,
                    contrastText: (isDarkMode ? MuiLightTheme : MuiDarkTheme).palette.text.primary
                },
                mode: isDarkMode ? 'dark' : 'light'
            },
            typography: {
                fontFamily
            }
        },
        getMuiLocalizationByName(locale),
        getMuiDateLocalizationByName(locale),
        getMuiGridLocalizationByName(locale)
    );

    const cookies = parseCookies();

    useEffect(() => {
        const appearance = cookies[COOKIE_APPEARANCE] as AppearanceType | undefined ?? 'system';

        const isBrowserDarkScheme = window.matchMedia('@media (prefers-color-scheme: dark)').matches;
        setAppearance({
            appearance: appearance,
            isDarkMode: appearance === 'dark' || (appearance === 'system' && isBrowserDarkScheme)
        });

        console.log(
            '%c警告',
            'font-size: 10rem; font-weight: 700; color: red; -webkit-text-stroke: 3px black; text-stroke: 3px black;'
        );
        console.log(
            '%cもし誰かからここに貼り付けるように指示されている場合、その行為はあなたのアカウントを危険にさらす可能性があります！',
            'font-size: 1.5rem; font-weight: 700; color: red;'
        );
        console.log(
            '%c何をしようとしているか分からない場合、速やかにこのウィンドウを閉じることをおすすめします。',
            'font-size: 1.5rem; font-weight: 700; color: red;'
        );
        console.log(
            'あなたが何をしているのか完全に理解しているのであれば、Bot や Web の開発を一緒にやってみませんか？\n',
            '公式サポートサーバーにてお待ちしております。 https://lunaproject.jp/support'
        );
    }, []);

    useEffect(() => {
        const documentElement = document.documentElement;
        if (isDarkMode) {
            documentElement.classList.add('dark');
        } else {
            documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <StyleProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles styles={{ Nunito, M_Plus_Rounded_1c, '*, ::before, ::after': { fontFamily } }} />
                <Navigation user={user} flags={flags} localization={localization} />
                <RootLayout>
                    {children}
                </RootLayout>
            </ThemeProvider>
        </StyleProvider>
    );
};

export const LayoutView = ({ user, flags, localization, children }: LayoutProps) => (
    <RecoilRoot>
        <Layout user={user} flags={flags} localization={localization}>{children}</Layout>
    </RecoilRoot>
);
