'use client';

import { CloudOffOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { PageContent, PageHeader } from '../../../components/layout';
import { Section } from '../../../components/section';

export const LoadingView = () => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">サーバー設定</Typography>
                <Typography variant="body1">設定したいサーバーを選択してください。</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageContent>
);

export const NotFoundView = () => (
    <PageContent display="flex">
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                placeContent: 'center',
                gap: 1
            }}
        >
            <CloudOffOutlined sx={{ fontSize: '10rem' }} color="primary" />
            <Typography variant="h4">サーバーが見つかりません</Typography>
            <Typography align="center">
                指定されたサーバーが見つかりませんでした。<br />
                あなたはそのサーバーの管理者ではないか、サーバーが存在しない可能性があります。<br />
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えてからお試しください。
            </Typography>
        </Box>
    </PageContent>
);

export const ForbiddenView = () => (
    <PageContent display="flex">
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                placeContent: 'center',
                gap: 1
            }}
        >
            <CloudOffOutlined sx={{ fontSize: '10rem' }} color="primary" />
            <Typography variant="h4">権限がありません</Typography>
            <Typography align="center">
                このサーバーの設定を変更する権限がありません。<br />
                このサーバーの設定を変更するには、サーバーのオーナーであるか、<b>サーバーの管理</b>権限が付与されている必要があります。<br />
                あなたに設定を変更する権限があることが明らかな場合は、ほかのアカウントに切り替えてからお試しください。
            </Typography>
        </Box>
    </PageContent>
);
