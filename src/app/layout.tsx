import React, { ReactNode } from 'react';
import '../../public/fonts/style.css';
import '../../public/global.css';
import { Body } from '../components/layout';
import { getLanguage } from '../languages/server';
import { Layout } from './layout_view';

export const generateMetadata = () => {
    const language = getLanguage();

    const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN as string;

    return {
        icons: {
            icon: [
                {
                    type: 'image/vnd.microsoft.icon',
                    url: `${origin}/icons/yudzuki.ico`
                },
                {
                    type: 'image/svg+xml',
                    url: `${origin}/icons/yudzuki.svg`
                }
            ]
        },
        title: {
            default: '結月 -ゆづき-',
            template: '%s | 結月 -ゆづき-'
        },
        description: 'Discord向けの多機能Bot「結月 -ゆづき-」の公式ホームページです。あなたも導入してみませんか？\nThis is the official website of "結月 -ゆづき-" the multifunctional bot for Discord.',
        themeColor: '#959ac0',
        openGraph: {
            type: 'website',
            locale: language === 'ja' ? 'ja-JP' : 'en-US',
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
    const language = getLanguage();

    return (
        <html lang={language}>
        <head />
        <Body>
            <Layout>{children}</Layout>
        </Body>
        </html>
    );
};

export default RootLayout;
