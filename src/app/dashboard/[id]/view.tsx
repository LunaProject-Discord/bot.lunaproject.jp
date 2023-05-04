'use client';

import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import {
    ArrowForwardOutlined,
    CloudOffOutlined,
    ErrorOutlineOutlined,
    InfoOutlined,
    LockPersonOutlined,
    TaskAltOutlined,
    WarningAmberOutlined
} from '@mui/icons-material';
import { Box, CircularProgress, Divider, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React, { Fragment } from 'react';
import { RouteLinkItem } from '../../../components/items';
import { PageContent, PageHeader } from '../../../components/layout';
import { GuildNotification } from '../../../interfaces/bot';
import { GuildViewProps, UserViewProps } from '../../../interfaces/view';

interface Props extends UserViewProps, GuildViewProps {
    notifications: GuildNotification[];
}

export const View = ({ user, guild, notifications, localization: { translations } }: Props) => (
    <PageContent>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">
                    {String(translations.welcome_to_name).replace('%n', user.username)}
                </Typography>
                <Typography variant="body1">ここは {guild.name} の設定ページです。</Typography>
            </Box>
        </PageHeader>
        <Section>
            <SectionTitle>このサーバーへのお知らせ</SectionTitle>
            <SectionContent>
                {notifications.filter((notification) => !notification.reads.includes(user.id)).slice(0, 4).map((notification) => (
                    <RouteLinkItem
                        key={notification.name}
                        icon={<Fragment>
                            {notification.type === 'success' && <TaskAltOutlined color="success" />}
                            {notification.type === 'warning' && <WarningAmberOutlined color="warning" />}
                            {notification.type === 'error' && <ErrorOutlineOutlined color="error" />}
                            {notification.type === 'information' && <InfoOutlined color="info" />}
                        </Fragment>}
                        primary={notification.title}
                        secondary={`${(notification.description.split('\n').length > 1 ? notification.description.split('\n')[0] : notification.description).substring(0, 50)}...`}
                        href={`/dashboard/${guild.id}/notifications/${notification.name}`}
                    />
                ))}
            </SectionContent>
            <Divider />
            <Link
                component={NextLink}
                href={`/dashboard/${guild.id}/notifications`}
                underline="hover"
                color="text.secondary"
                sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center', gap: .5 }}
            >
                すべてのお知らせを見る
                <ArrowForwardOutlined fontSize="small" sx={{ mb: .25 }} />
            </Link>
        </Section>
    </PageContent>
);

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
            <LockPersonOutlined sx={{ fontSize: '10rem' }} color="primary" />
            <Typography variant="h4">権限がありません</Typography>
            <Typography align="center">
                このサーバーの設定を変更する権限がありません。<br />
                このサーバーの設定を変更するには、サーバーのオーナーであるか、<b>サーバーの管理</b>権限が付与されている必要があります。<br />
                あなたに設定を変更する権限があることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </Typography>
        </Box>
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
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </Typography>
        </Box>
    </PageContent>
);
