'use client';

import {
    ArrowDropDownIcon,
    ArrowDropUpIcon,
    ErrorIcon,
    InfoIcon,
    KeyboardArrowRightIcon,
    OpenInNewIcon,
    TaskAltIcon,
    WarningIcon
} from '@components/icons';
import { RootLayout, RootStyles } from '@components/layout_v2';
import { UserFlags } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { StyleProvider } from '@lunaproject/web-core/dist/components/StyleProvider';
import { Config, ConfigProvider } from '@lunaproject/web-core/dist/utils/config';
import { MuiComponents, MuiDarkTheme, MuiLightTheme } from '@lunaproject/web-core/dist/utils/theme';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material';
import { appearanceAtom, AppearanceType } from '@states/appearance';
import { COOKIE_APPEARANCE } from '@utils/cookie';
import deepmerge from 'deepmerge';
import { useAtom } from 'jotai/index';
import { parseCookies } from 'nookies';
import React, { ReactNode, useEffect } from 'react';
import { getMuiDateLocalizationByName, getMuiGridLocalizationByName, getMuiLocalizationByName } from '../localizations';
import { Navigation } from './_navigation';
import { DefaultFontFamily } from './theme';

interface LayoutProps extends LocalizationProps {
    user: OAuthUser | undefined;
    flags: UserFlags | undefined;
    children: ReactNode;
}

export const LayoutView = ({ user, flags, localization, children }: LayoutProps) => {
    const { locale } = localization;

    const [{ isDarkMode }, setAppearance] = useAtom(appearanceAtom);

    const theme = createTheme(
        {
            components: deepmerge<ThemeOptions['components']>(
                MuiComponents,
                {
                    MuiAlert: {
                        defaultProps: {
                            iconMapping: {
                                success: <TaskAltIcon fontSize="inherit" />,
                                warning: <WarningIcon fontSize="inherit" />,
                                error: <ErrorIcon fontSize="inherit" />,
                                info: <InfoIcon fontSize="inherit" />
                            }
                        }
                    }
                }
            ),
            palette: (isDarkMode ? MuiDarkTheme : MuiLightTheme).palette,
            typography: {
                fontFamily: DefaultFontFamily
            }
        },
        getMuiLocalizationByName(locale),
        getMuiDateLocalizationByName(locale),
        getMuiGridLocalizationByName(locale)
    );

    const config: Config = {
        icons: {
            Decrement: ArrowDropDownIcon,
            Increment: ArrowDropUpIcon,
            More: KeyboardArrowRightIcon,
            OpenInNew: OpenInNewIcon
        }
    };

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
                <ConfigProvider value={config}>
                    <RootStyles />
                    <Navigation user={user} flags={flags} localization={localization} />
                    <RootLayout>
                        {children}
                    </RootLayout>
                </ConfigProvider>
            </ThemeProvider>
        </StyleProvider>
    );
};
