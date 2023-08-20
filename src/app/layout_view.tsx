'use client';

import { PageContainer } from '@components/layout';
import { UserFlags } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { StyleProvider } from '@lunaproject-discord/web-core/dist/components/StyleProvider';
import { MuiPalette } from '@lunaproject-discord/web-core/dist/utils/theme';
import { OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { indigo } from '@mui/material/colors';
import { appearanceAtom, AppearanceType } from '@states/appearance';
import { mediaPanelOpenAtom } from '@states/media';
import { COOKIE_APPEARANCE } from '@utils/cookie';
import { parseCookies } from 'nookies';
import React, { ReactNode, useEffect } from 'react';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { MediaPanel } from '@app/_panels/media';
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
    const open = useRecoilValue(mediaPanelOpenAtom);

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

    return (
        <StyleProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles styles={{ Nunito, M_Plus_Rounded_1c, '*, ::before, ::after': { fontFamily } }} />
                <Navigation user={user} flags={flags} localization={localization} />
                <PageContainer sx={{ mr: { xl: open ? '400px' : 0 } }}>
                    {children}
                </PageContainer>
                {user && flags && flags.tester && <MediaPanel user={user} localization={localization} />}
            </ThemeProvider>
        </StyleProvider>
    );
};

export const LayoutView = ({ user, flags, localization, children }: LayoutProps) => (
    <RecoilRoot>
        <Layout user={user} flags={flags} localization={localization}>{children}</Layout>
    </RecoilRoot>
);
