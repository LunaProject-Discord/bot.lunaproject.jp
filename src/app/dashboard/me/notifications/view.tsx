'use client';

import { PageContent, PageHeader } from '@components/layout';
import { UserNotification } from '@interfaces/bot';
import { UserViewProps } from '@interfaces/view';
import { useLocale } from '@localizations/client';
import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { format } from '@lunaproject-discord/web-core/dist/utils/date';
import { ErrorOutlineOutlined, InfoOutlined, TaskAltOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { enUS, ja } from 'date-fns/locale';
import React, { Fragment } from 'react';
import { RouteLinkItem } from '../../../../components/items';

interface Props extends UserViewProps {
    notifications: UserNotification[];
}


export const View = ({ user, notifications, localization: { translations } }: Props) => {
    const language = useLocale();

    const userNotifications: Record<string, UserNotification[]> = {};

    notifications.forEach((notification) => {
        const date = format(notification.createdAt, 'yyyy-MM-dd');
        if (!userNotifications[date])
            userNotifications[date] = [];

        userNotifications[date].push(notification);
    });

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.notifications}</Typography>
                    <Typography></Typography>
                </Box>
            </PageHeader>
            {Object.keys(userNotifications).map((date) => {
                return (
                    <Section key={date}>
                        <SectionTitle>
                            {format(
                                date,
                                translations.pattern_date as string,
                                { locale: language === 'ja' ? ja : enUS }
                            )}
                        </SectionTitle>
                        <SectionContent>
                            {userNotifications[date].sort((a, b) => b.createdAt - a.createdAt).map((notification) => (
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
                    </Section>
                );
            })}
        </PageContent>
    );
};
