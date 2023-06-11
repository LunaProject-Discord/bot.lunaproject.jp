'use client';

import { PageContainer } from '@components/layout';
import { LocalizationProps } from '@interfaces/localization';
import { StyleProvider } from '@lunaproject-discord/web-core/dist/components/StyleProvider';
import { MuiPalette } from '@lunaproject-discord/web-core/dist/utils/theme';
import { OAuthUser } from '@lunaproject-discord/web-discord';
import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { indigo } from '@mui/material/colors';
import { appearanceAtom, AppearanceType } from '@states/appearance';
import { COOKIE_APPEARANCE } from '@utils/cookie';
import { fetchWithUser } from '@utils/swr';
import { parseCookies } from 'nookies';
import React, { ReactNode, useEffect } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import useSWRImmutable from 'swr/immutable';
import { getMuiDateLocalizationByName, getMuiLocalizationByName } from '../localizations';
import { Navigation } from './_navigation';
import { fontFamily, M_Plus_Rounded_1c, Nunito } from './theme';

interface LayoutProps extends LocalizationProps {
    children: ReactNode;
}

const Layout = ({ children, localization }: LayoutProps) => {
    const { locale } = localization;

    const [{ isDarkMode }, setAppearance] = useRecoilState(appearanceAtom);

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
                    light: indigo[isDarkMode ? 'A200' : 300],
                    main: indigo[isDarkMode ? 'A400' : 500],
                    dark: indigo[isDarkMode ? 'A700' : 700]
                },
                mode: isDarkMode ? 'dark' : 'light'
            },
            typography: {
                fontFamily
            }
        },
        getMuiLocalizationByName(locale),
        getMuiDateLocalizationByName(locale)
    );

    const cookies = parseCookies();
    const token = cookies['token'];

    const { data, error } = useSWRImmutable<OAuthUser>(
        token ? ['https://discord.com/api/v10/users/@me', token] : null,
        ([url, token]: string[]) => fetchWithUser(url, token)
    );

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

    return (
        <StyleProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles styles={{ Nunito, M_Plus_Rounded_1c, '*, ::before, ::after': { fontFamily } }} />
                <Navigation user={data} localization={localization} />
                <PageContainer>
                    {children}
                </PageContainer>
            </ThemeProvider>
        </StyleProvider>
    );
};

export const LayoutView = ({ children, localization }: LayoutProps) => (
    <RecoilRoot>
        <Layout localization={localization}>{children}</Layout>
    </RecoilRoot>
);
