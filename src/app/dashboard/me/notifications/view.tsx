'use client';

import { ErrorIcon, InfoIcon, TaskAltIcon, WarningIcon } from '@/components/icons';
import { RouteLinkItem } from '@/components/items';
import { PageHeader } from '@/components/layout_v2';
import { UserNotification } from '@/interfaces/bot';
import { UserViewProps } from '@/interfaces/view';
import { getDateFnsLocaleByName } from '@/localizations';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { format } from '@lunaproject/web-core/dist/utils/date';
import React, { Fragment } from 'react';

interface Props extends UserViewProps {
    notifications: UserNotification[];
}

export const View = ({ user, notifications, localization: { locale, translations } }: Props) => {
    const userNotifications: Record<string, UserNotification[]> = {};

    notifications.forEach((notification) => {
        const date = format(notification.createdAt, 'yyyy-MM-dd');
        if (!userNotifications[date])
            userNotifications[date] = [];

        userNotifications[date].push(notification);
    });

    return (
        <Fragment>
            <PageHeader primary={translations.notifications} />
            {Object.keys(userNotifications).map((date) => {
                return (
                    <Section key={date}>
                        <SectionTitle>
                            {format(
                                date,
                                translations.pattern_date as string,
                                { locale: getDateFnsLocaleByName(locale) }
                            )}
                        </SectionTitle>
                        <SectionContent>
                            {userNotifications[date].sort((a, b) => b.createdAt - a.createdAt).map((notification) => (
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
                    </Section>
                );
            })}
        </Fragment>
    );
};
