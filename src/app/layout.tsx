import { getUser } from '@/app/utils';
import { getUserFlags } from '@/libs/bot';
import { getLocale, getLocalization } from '@/localizations/server';
import { AppearanceType } from '@/states/appearance';
import { COOKIE_APPEARANCE } from '@/utils/cookie';
import { Body } from '@lunaproject/web-core/dist/components/Layout';
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import React, { ReactNode } from 'react';
import { LayoutView } from './layout_view';

import '../../public/fonts/style.css';
import '../../public/global.css';
import 'react-spring-bottom-sheet/dist/style.css';

export const viewport: Viewport = {
    themeColor: '#959ac0'
};

export const generateMetadata = (): Metadata => {
    const locale = getLocale();

    const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN as string;

    return {
        title: {
            default: '結月 -ゆづき-',
            template: '%s | 結月 -ゆづき-'
        },
        description: 'Discord向けの多機能Bot「結月 -ゆづき-」の公式ホームページです。あなたも導入してみませんか？\nThis is the official website of "結月 -ゆづき-" the multifunctional bot for Discord.',
        openGraph: {
            type: 'website',
            locale: locale === 'ja' ? 'ja-JP' : 'en-US',
            siteName: '結月 -ゆづき-',
            url: origin,
            title: '結月 -ゆづき-',
            description: 'Discord向けの多機能Bot「結月 -ゆづき-」の公式ホームページです。あなたも導入してみませんか？\nThis is the official website of "結月 -ゆづき-" the multifunctional bot for Discord.',
            images: [
                {
                    url: `${origin}/thumbnail.png`,
                    secureUrl: `${origin}/thumbnail.png`
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: '結月 -ゆづき-',
            description: 'Discord向けの多機能Bot「結月 -ゆづき-」の公式ホームページです。あなたも導入してみませんか？\nThis is the official website of "結月 -ゆづき-" the multifunctional bot for Discord.',
            siteId: '1216350706103246849',
            creator: '@Yudzuki_Discord',
            creatorId: '1216350706103246849',
            images: [`${origin}/thumbnail.png`]
        }
    };
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const localization = getLocalization();
    const { locale } = localization;

    const nextCookies = cookies();
    const appearance = nextCookies.get(COOKIE_APPEARANCE)?.value as AppearanceType | undefined ?? 'system';

    const user = await getUser();
    const userFlags = user ? await getUserFlags(user.id) : undefined;

    return (
        <html lang={locale} className={appearance !== 'system' ? appearance : undefined}>
        <head>
            <link
                rel="preload"
                as="font"
                type="font/woff2"
                href="/fonts/nunito/nunito_400_normal.woff2"
            />
            <link
                rel="preload"
                as="font"
                type="font/woff2"
                href="/fonts/nunito/nunito_700_normal.woff2"
            />
            <link
                rel="preload"
                as="font"
                type="font/woff2"
                href="/fonts/m-plus-rounded-1c/m-plus-rounded-1c_400_normal.woff2"
            />
            <link
                rel="preload"
                as="font"
                type="font/woff2"
                href="/fonts/m-plus-rounded-1c/m-plus-rounded-1c_700_normal.woff2"
            />
            <link
                rel="preload"
                as="font"
                type="font/woff2"
                href="/fonts/line-seed-jp/line-seed-jp_600_normal.woff2"
            />
            <script
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                if ('${appearance}' !== 'system')
                                    return;
                                
                                const documentElement = document.documentElement;
                                
                                documentElement.classList.remove('light', 'dark');
                                
                                const matches = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                documentElement.classList.add(matches ? 'dark' : 'light');
                            } catch (e) {
                            
                            }
                        })();
                    `
                }}
            />
        </head>
        <Body>
            <LayoutView user={user} flags={userFlags} appearance={appearance} localization={localization}>
                {children}
            </LayoutView>
        </Body>
        </html>
    );
};

export default RootLayout;
