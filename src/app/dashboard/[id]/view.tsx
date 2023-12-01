'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@components/error';
import { RouteLinkItem } from '@components/items';
import { PageHeader } from '@components/layout';
import { PageCenteredLayout } from '@components/layout_v2';
import { GuildNotification } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { GuildViewProps, UserViewProps } from '@interfaces/view';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
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
import { getUserDisplayName } from '@utils/discord';
import NextLink from 'next/link';
import React, { Fragment } from 'react';

interface Props extends UserViewProps, GuildViewProps {
    notifications: GuildNotification[];
}

export const View = ({ user, guild, notifications, localization: { translations } }: Props) => (
    <Fragment>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">
                    {String(translations.welcome_to_name).replace('%n', getUserDisplayName(user))}
                </Typography>
                <Typography>ここは {guild.name} の設定ページです。</Typography>
            </Box>
        </PageHeader>
        <Section>
            <SectionTitle>このサーバーへのお知らせ</SectionTitle>
            <SectionContent>
                {notifications.filter((notification) => !notification.reads.includes(user.id)).slice(0, 4).map((notification) => (
                    <RouteLinkItem
                        key={notification.id}
                        icon={<Fragment>
                            {notification.type === 'success' && <TaskAltOutlined color="success" />}
                            {notification.type === 'warning' && <WarningAmberOutlined color="warning" />}
                            {notification.type === 'error' && <ErrorOutlineOutlined color="error" />}
                            {notification.type === 'information' && <InfoOutlined color="info" />}
                        </Fragment>}
                        primary={notification.title}
                        secondary={notification.description.split('\n').length > 1 ? notification.description.split('\n')[0] : notification.description}
                        secondaryTypographyProps={{
                            sx: {
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            }
                        }}
                        href={`/dashboard/${guild.id}/notifications/${notification.id}`}
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
    </Fragment>
);

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.guild_settings}</Typography>
                <Typography>{translations.loading}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const ForbiddenView = () => (
    <PageCenteredLayout>
        <ErrorRoot>
            <LockPersonOutlined color="primary" sx={{ fontSize: '10rem' }} />
            <ErrorTitle>権限がありません</ErrorTitle>
            <ErrorDescription>
                このサーバーの設定を変更する権限がありません。<br />
                このサーバーの設定を変更するには、サーバーのオーナーであるか、<b>サーバーの管理</b>権限が付与されている必要があります。<br />
                あなたに設定を変更する権限があることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </ErrorDescription>
        </ErrorRoot>
    </PageCenteredLayout>
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
