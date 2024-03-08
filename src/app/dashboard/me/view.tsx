'use client';

import { ArrowForwardIcon, ErrorIcon, InfoIcon, TaskAltIcon, WarningIcon } from '@/components/icons';
import { RouteLinkItem } from '@/components/items';
import { UserNotification } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { UserViewProps } from '@/interfaces/view';
import { getUserDisplayName } from '@/utils/discord';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { CircularProgress, Divider, Link } from '@mui/material';
import NextLink from 'next/link';
import React, { Fragment } from 'react';

interface Props extends UserViewProps {
    notifications: UserNotification[];
}

export const View = ({ user, notifications, localization: { translations } }: Props) => (
    <Fragment>
        <PageHeader
            primary={String(translations.welcome_to_name).replace('%n', getUserDisplayName(user))}
            secondary="ここはユーザーの設定ページです。"
        />
        <Section>
            <SectionTitle>{getUserDisplayName(user)} さんへのお知らせ</SectionTitle>
            <SectionContent>
                {notifications.filter((notification) => !notification.read).slice(0, 4).map((notification) => (
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
                        href={`/dashboard/me/notifications/${notification.id}`}
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
                <ArrowForwardIcon fontSize="small" sx={{ mb: .25 }} />
            </Link>
        </Section>
    </Fragment>
);

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.user_settings} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);
