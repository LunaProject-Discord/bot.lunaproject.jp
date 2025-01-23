'use client';

import { ErrorIcon, InfoIcon, TaskAltIcon, WarningIcon } from '@/components/icons';
import { GuildNotification } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { SectionRouteLinkCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { DateTime } from 'luxon';
import React, { Fragment } from 'react';

interface Props extends GuildViewProps {
    notifications: GuildNotification[];
}

export const View = ({ guild, notifications, localization: { locale, translations } }: Props) => {
    const guildNotifications: Record<string, GuildNotification[]> = {};

    notifications.forEach((notification) => {
        const date = DateTime.fromMillis(
            notification.createdAt,
            {
                zone: 'Asia/Tokyo',
                locale
            }
        ).toFormat(translations.pattern_date_luxon as string);

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
                            {date}
                        </SectionTitle>
                        <SectionContent>
                            {guildNotifications[date].sort((a, b) => b.createdAt - a.createdAt).map((notification) => (
                                <SectionRouteLinkCard
                                    key={notification.id}
                                    icon={<Fragment>
                                        {notification.type === 'success' && <TaskAltIcon color="success" />}
                                        {notification.type === 'warning' && <WarningIcon color="warning" />}
                                        {notification.type === 'error' && <ErrorIcon color="error" />}
                                        {notification.type === 'information' && <InfoIcon color="info" />}
                                    </Fragment>}
                                    primary={notification.title}
                                    secondary={notification.description.split('\n').length > 1 ? notification.description.split('\n')[0] : notification.description}
                                    href={`/dashboard/${guild.id}/notifications/${notification.id}`}
                                    slotProps={{
                                        display: {
                                            secondary: {
                                                sx: {
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden'
                                                }
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </SectionContent>
                    </Section>
                );
            })}
        </Fragment>
    );
};
