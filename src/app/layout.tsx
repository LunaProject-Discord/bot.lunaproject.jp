import { Metadata } from 'next';
import React, { ReactNode } from 'react';
import '../../public/fonts/style.css';
import '../../public/global.css';
import { Body } from '../components/layout';
import { getLocale, getLocalization } from '../localizations/server';
import { Layout } from './layout_view';

export const generateMetadata = (): Metadata => {
    const locale = getLocale();

    const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN as string;

    return {
        title: {
            default: '結月 -ゆづき-',
            template: '%s | 結月 -ゆづき-'
        },
        description: 'Discord向けの多機能Bot「結月 -ゆづき-」の公式ホームページです。あなたも導入してみませんか？\nThis is the official website of "結月 -ゆづき-" the multifunctional bot for Discord.',
        themeColor: '#959ac0',
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

const RootLayout = ({ children }: { children: ReactNode }) => {
    const localization = getLocalization();
    const { locale } = localization;

    return (
        <html lang={locale}>
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
        </head>
        <Body>
            <Layout localization={localization}>{children}</Layout>
        </Body>
        </html>
    );
};

export default RootLayout;
