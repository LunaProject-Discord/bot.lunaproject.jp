'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@components/error';
import { RouteLinkItem } from '@components/items';
import { PageHeader } from '@components/layout';
import { PageCenteredLayout } from '@components/layout_v2';
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

interface Props extends UserViewProps {
    notifications: UserNotification[];
}

export const View = ({ user, notifications, localization: { translations } }: Props) => (
    <Fragment>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">
                    {String(translations.welcome_to_name).replace('%n', getUserDisplayName(user))}
                </Typography>
                <Typography>ここはユーザーの設定ページです。</Typography>
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
    </Fragment>
);

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.user_settings}</Typography>
                <Typography>{translations.loading}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const NotFoundView = () => (
    <PageCenteredLayout>
        <ErrorRoot>
            <CloudOffOutlined color="primary" sx={{ fontSize: '10rem' }} />
            <ErrorTitle>サーバーが見つかりません</ErrorTitle>
            <ErrorDescription>
                指定されたサーバーが見つかりませんでした。<br />
                あなたはそのサーバーの管理者ではないか、サーバーが存在しない可能性があります。<br />
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </ErrorDescription>
        </ErrorRoot>
    </PageCenteredLayout>
);
