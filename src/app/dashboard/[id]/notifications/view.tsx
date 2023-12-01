'use client';

import { RouteLinkItem } from '@components/items';
import { PageHeader } from '@components/layout';
import { GuildNotification } from '@interfaces/bot';
import { GuildViewProps } from '@interfaces/view';
import { getDateFnsLocaleByName } from '@localizations/index';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { format } from '@lunaproject/web-core/dist/utils/date';
import { ErrorOutlineOutlined, InfoOutlined, TaskAltOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
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
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.notifications}</Typography>
                    <Typography></Typography>
                </Box>
            </PageHeader>
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
                    </Section>
                );
            })}
        </Fragment>
    );
};
