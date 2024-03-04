'use client';

import {
    ArrowDropDownIcon,
    ArrowDropUpIcon,
    ErrorIcon,
    FirstPageIcon,
    InfoIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
    LastPageIcon,
    OpenInNewIcon,
    TableRowsIcon,
    TaskAltIcon,
    WarningIcon
} from '@/components/icons';
import { RootLayout, RootStyles } from '@/components/layout_v2';
import { UserFlags } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { getMuiDateLocalizationByName, getMuiGridLocalizationByName, getMuiLocalizationByName } from '@/localizations';
import { appearanceAtom, AppearanceType } from '@/states/appearance';
import { Config, ConfigProvider } from '@lunaproject/web-core/dist/utils/config';
import { borderAndBoxShadow, MuiComponents, MuiDarkTheme, MuiLightTheme } from '@lunaproject/web-core/dist/utils/theme';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import {
    buttonClasses,
    createTheme,
    linearProgressClasses,
    ThemeOptions,
    ThemeProvider,
    useMediaQuery
} from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import deepmerge from 'deepmerge';
import { useAtom } from 'jotai';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Navigation } from './_navigation';
import { DefaultFontFamily } from './theme';

interface LayoutProps extends LocalizationProps {
    user: OAuthUser | undefined;
    flags: UserFlags | undefined;
    appearance: AppearanceType;
    children: ReactNode;
}

export const LayoutView = ({ user, flags, appearance: initialAppearance, localization, children }: LayoutProps) => {
    const { locale } = localization;

    const [{ isDarkMode }, setAppearance] = useAtom(appearanceAtom);
    const [loaded, setLoaded] = useState(false);

    const isBrowserDarkScheme = useMediaQuery('(prefers-color-scheme: dark)');
    const isInitialDarkScheme = initialAppearance === 'dark' || (initialAppearance === 'system' && isBrowserDarkScheme);
    const isDarkTheme = loaded ? isDarkMode : isInitialDarkScheme;

    const theme = useMemo(() => createTheme(
        {
            components: deepmerge<ThemeOptions['components']>(
                MuiComponents,
                {
                    MuiAlert: {
                        defaultProps: {
                            iconMapping: {
                                success: (<TaskAltIcon fontSize="inherit" />),
                                warning: (<WarningIcon fontSize="inherit" />),
                                error: (<ErrorIcon fontSize="inherit" />),
                                info: (<InfoIcon fontSize="inherit" />)
                            }
                        }
                    },
                    MuiButton: {
                        variants: [
                            {
                                props: {
                                    variant: 'outlined',
                                    color: 'monotone'
                                },
                                style: ({ theme }) => ({
                                    borderColor: theme.palette.divider,
                                    [`&:disabled, &.${buttonClasses.disabled}`]: {
                                        borderColor: theme.palette.action.disabled
                                    },
                                    '&:hover': {
                                        backgroundColor: theme.palette.divider,
                                        borderColor: 'transparent'
                                    }
                                })
                            }
                        ]
                    },
                    MuiLinearProgress: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                [`&, & .${linearProgressClasses.bar}`]: {
                                    borderRadius: theme.shape.borderRadius
                                }
                            })
                        }
                    },
                    MuiTablePagination: {
                        defaultProps: {
                            labelRowsPerPage: (<TableRowsIcon />),
                            slots: {
                                actions: {
                                    firstButtonIcon: FirstPageIcon,
                                    lastButtonIcon: LastPageIcon,
                                    nextButtonIcon: KeyboardArrowRightIcon,
                                    previousButtonIcon: KeyboardArrowLeftIcon
                                }
                            },
                            slotProps: {
                                select: {
                                    MenuProps: {
                                        slotProps: {
                                            paper: {
                                                sx: (theme) => borderAndBoxShadow(theme)
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        styleOverrides: {
                            root: {
                                flexShrink: 0,
                                userSelect: 'none',
                                border: 'none'
                            },
                            toolbar: {
                                padding: '0 !important'
                            },
                            selectLabel: {
                                lineHeight: 0
                            }
                        }
                    }
                }
            ),
            palette: (isDarkTheme ? MuiDarkTheme : MuiLightTheme).palette,
            typography: {
                fontFamily: DefaultFontFamily
            }
        },
        getMuiLocalizationByName(locale),
        getMuiDateLocalizationByName(locale),
        getMuiGridLocalizationByName(locale)
    ), [isDarkTheme, locale]);

    const config: Config = {
        icons: {
            Decrement: ArrowDropDownIcon,
            Increment: ArrowDropUpIcon,
            More: KeyboardArrowRightIcon,
            OpenInNew: OpenInNewIcon
        }
    };

    useEffect(() => {
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
        setAppearance({ appearance: initialAppearance, isDarkMode: isInitialDarkScheme });
        if (!loaded)
            setLoaded(() => true);
    }, [initialAppearance, isInitialDarkScheme, loaded, setAppearance]);

    useEffect(() => {
        const documentElement = document.documentElement;
        if (isDarkTheme) {
            documentElement.classList.add('dark');
        } else {
            documentElement.classList.remove('dark');
        }
    }, [isDarkTheme]);

    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <ConfigProvider value={config}>
                    <RootStyles />
                    <Navigation user={user} flags={flags} localization={localization} />
                    <RootLayout>
                        {children}
                    </RootLayout>
                </ConfigProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
};
