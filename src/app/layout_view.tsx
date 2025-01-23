'use client';

import {
    ArrowBackIcon,
    ArrowDownwardIcon,
    ArrowDropDownIcon,
    ArrowDropUpIcon,
    ArrowForwardIcon,
    ArrowUpwardIcon,
    ErrorIcon,
    FirstPageIcon,
    InfoIcon,
    KeyboardArrowDownIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
    KeyboardArrowUpIcon,
    LastPageIcon,
    OpenInNewIcon,
    TableRowsIcon,
    TaskAltIcon,
    ToggleOffIcon,
    ToggleOnIcon,
    WarningIcon
} from '@/components/icons';
import { UserFlags } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { getMuiDateLocalizationByName, getMuiGridLocalizationByName, getMuiLocalizationByName } from '@/localizations';
import { appearanceAtom, AppearanceType } from '@/states/appearance';
import { RootLayout, RootStyles } from '@lunaproject/web-core/dist/components/Layout';
import {
    Config,
    ConfigProvider,
    MuiColorSchemes,
    MuiComponents,
    MuiCssVariables,
    MuiTypography
} from '@lunaproject/web-core/dist/utils';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { createTheme, GlobalStyles, ThemeOptions, ThemeProvider, useMediaQuery } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import deepmerge from 'deepmerge';
import { useAtom } from 'jotai';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { Navigation } from './_navigation';
import { DefaultFontFamily, LINE_Seed_JP, M_Plus_Rounded_1c, Nunito } from './theme';

const insertGlobalStyles = (
    <GlobalStyles
        styles={(theme) => ({
            Nunito,
            M_Plus_Rounded_1c,
            LINE_Seed_JP,

            '*, ::before, ::after': {
                fontFamily: DefaultFontFamily
            },

            'em-emoji-picker': {
                borderRadius: theme.shape.borderRadius
            }
        })}
    />
);

interface LayoutProps extends LocalizationProps {
    user: OAuthUser | undefined;
    flags: UserFlags | undefined;
    appearance: AppearanceType;
    children: ReactNode;
}

export const LayoutView = ({ user, flags, appearance: initialAppearance, localization, children }: LayoutProps) => {
    const { locale, translations } = localization;

    const theme = useMemo(() => createTheme(
        {
            cssVariables: MuiCssVariables,
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
                    MuiDialogTitle: {
                        styleOverrides: {
                            root: ({ theme }) => theme.typography.h4
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
                            }
                        }
                    }
                }
            ),
            colorSchemes: MuiColorSchemes,
            typography: deepmerge<TypographyOptions>(
                MuiTypography,
                {
                    fontFamily: DefaultFontFamily
                }
            )
        },
        getMuiLocalizationByName(locale),
        getMuiDateLocalizationByName(locale),
        getMuiGridLocalizationByName(locale)
    ), [locale]);

    const config: Config = {
        components: {
            SectionCard: {
                variant: 'outlined'
            }
        },
        icons: {
            ArrowBack: ArrowBackIcon,
            ArrowDownward: ArrowDownwardIcon,
            ArrowForward: ArrowForwardIcon,
            ArrowUpward: ArrowUpwardIcon,
            Decrement: ArrowDropDownIcon,
            ExpandLess: KeyboardArrowUpIcon,
            ExpandMore: KeyboardArrowDownIcon,
            Increment: ArrowDropUpIcon,
            KeyboardArrowDown: KeyboardArrowDownIcon,
            KeyboardArrowLeft: KeyboardArrowLeftIcon,
            KeyboardArrowRight: KeyboardArrowRightIcon,
            KeyboardArrowUp: KeyboardArrowUpIcon,
            More: KeyboardArrowRightIcon,
            OpenInNew: OpenInNewIcon,
            ToggleOff: ToggleOffIcon,
            ToggleOn: ToggleOnIcon
        },
        translations: {
            close: translations.close,
            open: translations.open
        }
    };

    const [{ appearance }, setAppearance] = useAtom(appearanceAtom);

    const isBrowserDarkScheme = useMediaQuery('(prefers-color-scheme: dark)');
    const isInitialDarkScheme = initialAppearance === 'dark' || (initialAppearance === 'system' && isBrowserDarkScheme);

    useEffect(() => {
        const documentElement = document.documentElement;

        documentElement.classList.remove('light', 'dark');

        if (appearance !== 'system') {
            documentElement.classList.add(appearance);
            return;
        }

        documentElement.classList.add(isBrowserDarkScheme ? 'dark' : 'light');
        setAppearance({ appearance, isDarkMode: isBrowserDarkScheme });
    }, [appearance, isBrowserDarkScheme, setAppearance]);

    useEffect(() => {
        setAppearance({ appearance: initialAppearance, isDarkMode: isInitialDarkScheme });

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

    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme} colorSchemeNode={null} disableTransitionOnChange>
                <ConfigProvider value={config}>
                    <RootStyles />
                    {insertGlobalStyles}
                    <Navigation user={user} flags={flags} localization={localization} />
                    <RootLayout>
                        {children}
                    </RootLayout>
                </ConfigProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
};
