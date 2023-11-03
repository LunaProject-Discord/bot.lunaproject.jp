'use client';

import { NAVIGATION_DRAWER_WIDTH } from '@components/navigation';
import { Box, styled } from '@mui/material';

export const RootLayout = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: theme.breakpoints.values.xl,
    margin: '0 auto',
    paddingTop: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(8)
    }
}));

export const PageLayout = styled('main')(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(3)
}));

export const PageWithSidebarLayout = styled(PageLayout)(({ theme }) => ({
    padding: 0,
    [theme.breakpoints.up('md')]: {
        // 表示範囲の幅 - (ナビゲーションドロワーの幅 + サイドバーとの余白)
        maxWidth: `calc(100% - calc(${NAVIGATION_DRAWER_WIDTH}px + ${theme.spacing(3)}))`
    }
}));

export const PageCenteredLayout = styled(PageLayout)(({ theme }) => ({
    // 表示範囲の高さ - ヘッダーの高さ
    height: `calc(100dvh - ${theme.spacing(7)})`,
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
    [theme.breakpoints.up('sm')]: {
        // 表示範囲の高さ - ヘッダーの高さ
        height: `calc(100dvh - ${theme.spacing(8)})`
    }
}));
