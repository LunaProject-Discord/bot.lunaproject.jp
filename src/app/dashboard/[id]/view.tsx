'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import {
    ArrowForwardIcon,
    CloudOffIcon,
    ErrorIcon,
    InfoIcon,
    LockPersonIcon,
    TaskAltIcon,
    WarningIcon
} from '@/components/icons';
import { RouteLinkItem } from '@/components/items';
import { PageCenteredLayout, PageHeader } from '@/components/layout_v2';
import { GuildNotification } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { GuildViewProps, UserViewProps } from '@/interfaces/view';
import { getUserDisplayName } from '@/utils/discord';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { CircularProgress, Divider, Link } from '@mui/material';
import NextLink from 'next/link';
import React, { Fragment } from 'react';

interface Props extends UserViewProps, GuildViewProps {
    notifications: GuildNotification[];
}

export const View = ({ user, guild, notifications, localization: { translations } }: Props) => (
    <Fragment>
        <PageHeader
            primary={String(translations.welcome_to_name).replace('%n', getUserDisplayName(user))}
            secondary={`ここは ${guild.name} の設定ページです。`}
        />
        <Section>
            <SectionTitle>このサーバーへのお知らせ</SectionTitle>
            <SectionContent>
                {notifications.filter((notification) => !notification.reads.includes(user.id)).slice(0, 4).map((notification) => (
                    <RouteLinkItem
                        key={notification.id}
                        icon={<Fragment>
                            {notification.type === 'success' && <TaskAltIcon color="success" />}
                            {notification.type === 'warning' && <WarningIcon color="warning" />}
                            {notification.type === 'error' && <ErrorIcon color="error" />}
                            {notification.type === 'information' && <InfoIcon color="info" />}
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
                <ArrowForwardIcon fontSize="small" sx={{ mb: .25 }} />
            </Link>
        </Section>
    </Fragment>
);

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.guild_settings} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const ForbiddenView = () => (
    <PageCenteredLayout>
        <ErrorRoot>
            <LockPersonIcon sx={{ fontSize: '10rem' }} />
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
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>サーバーが見つかりません</ErrorTitle>
            <ErrorDescription>
                指定されたサーバーが見つかりませんでした。<br />
                あなたはそのサーバーの管理者ではないか、サーバーが存在しない可能性があります。<br />
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </ErrorDescription>
        </ErrorRoot>
    </PageCenteredLayout>
);
