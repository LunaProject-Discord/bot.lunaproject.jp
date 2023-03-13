'use client';

import { format } from '@lunaproject-discord/web-core/dist/utils';
import { ErrorOutlineOutlined, InfoOutlined, TaskAltOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { enUS, ja } from 'date-fns/locale';
import React, { Fragment } from 'react';
import { RouteLinkItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { Section, SectionContent, SectionTitle } from '../../../../components/section';
import { GuildNotification } from '../../../../interfaces/bot';
import { GuildViewProps } from '../../../../interfaces/view';
import { useLanguage } from '../../../../languages/client';
import { StyledToolbar } from '../navigation';

interface Props extends GuildViewProps {
    notifications: GuildNotification[];
}


export const View = ({ guild, notifications, translations }: Props) => {
    const language = useLanguage();

    const guildNotifications: Record<string, GuildNotification[]> = {};

    notifications.forEach((notification) => {
        const date = format(notification.createdAt, 'yyyy-MM-dd');
        if (!guildNotifications[date])
            guildNotifications[date] = [];

        guildNotifications[date].push(notification);
    });

    return (
        <PageContent>
            <StyledToolbar />
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.notifications}</Typography>
                    <Typography variant="body1"></Typography>
                </Box>
            </PageHeader>
            {Object.keys(guildNotifications).map((date) => {
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
                            {guildNotifications[date].sort((a, b) => b.createdAt - a.createdAt).map((notification) => (
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
                                    href={`/dashboard/${guild.id}/notifications/${notification.name}`}
                                />
                            ))}
                        </SectionContent>
                    </Section>
                );
            })}
        </PageContent>
    );
};
