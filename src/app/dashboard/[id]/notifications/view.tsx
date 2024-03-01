'use client';

import { ErrorIcon, InfoIcon, TaskAltIcon, WarningIcon } from '@/components/icons';
import { RouteLinkItem } from '@/components/items';
import { PageHeader } from '@/components/layout_v2';
import { GuildNotification } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { getDateFnsLocaleByName } from '@/localizations/index';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { format } from '@lunaproject/web-core/dist/utils/date';
import React, { Fragment } from 'react';

interface Props extends GuildViewProps {
    notifications: GuildNotification[];
}

export const View = ({ guild, notifications, localization: { locale, translations } }: Props) => {
    const guildNotifications: Record<string, GuildNotification[]> = {};

    notifications.forEach((notification) => {
        const date = format(notification.createdAt, 'yyyy-MM-dd');
        if (!guildNotifications[date])
            guildNotifications[date] = [];

        guildNotifications[date].push(notification);
    });

    return (
        <Fragment>
            <PageHeader primary={translations.notifications} />
            {Object.keys(guildNotifications).map((date) => {
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
                            {guildNotifications[date].sort((a, b) => b.createdAt - a.createdAt).map((notification) => (
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
                    </Section>
                );
            })}
        </Fragment>
    );
};
