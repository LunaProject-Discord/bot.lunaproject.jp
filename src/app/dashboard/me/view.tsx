'use client';

import { PageContent, PageHeader } from '@components/layout';
import { UserNotification } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { UserViewProps } from '@interfaces/view';
import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import {
    ArrowForwardOutlined,
    CloudOffOutlined,
    ErrorOutlineOutlined,
    InfoOutlined,
    TaskAltOutlined,
    WarningAmberOutlined
} from '@mui/icons-material';
import { Box, CircularProgress, Divider, Link, Typography } from '@mui/material';
import { getUserDisplayName } from '@utils/discord';
import NextLink from 'next/link';
import React, { Fragment } from 'react';
import { RouteLinkItem } from '../../../components/items';

interface Props extends UserViewProps {
    notifications: UserNotification[];
}

export const View = ({ user, notifications, localization: { translations } }: Props) => (
    <PageContent>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">
                    {String(translations.welcome_to_name).replace('%n', getUserDisplayName(user))}
                </Typography>
                <Typography variant="body1">ここはユーザーの設定ページです。</Typography>
            </Box>
        </PageHeader>
        <Section>
            <SectionTitle>{getUserDisplayName(user)} さんへのお知らせ</SectionTitle>
            <SectionContent>
                {notifications.filter((notification) => !notification.read).slice(0, 4).map((notification) => (
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
                        href={`/dashboard/me/notifications/${notification.name}`}
                    />
                ))}
            </SectionContent>
            <Divider />
            <Link
                component={NextLink}
                href={`/dashboard/me/notifications`}
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

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.user_settings}</Typography>
                <Typography variant="body1" />
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
            <CloudOffOutlined color="primary" sx={{ fontSize: '10rem' }} />
            <Typography variant="h4">サーバーが見つかりません</Typography>
            <Typography align="center">
                指定されたサーバーが見つかりませんでした。<br />
                あなたはそのサーバーの管理者ではないか、サーバーが存在しない可能性があります。<br />
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </Typography>
        </Box>
    </PageContent>
);
