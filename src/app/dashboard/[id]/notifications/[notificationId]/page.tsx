import { getUser } from '@/app/utils';
import { NotificationPageParamsProps } from '@/interfaces/page';
import { getGuildNotification, hasDashboardAccess, setGuildNotificationRead } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { NotFoundView } from '../../view';
import { View } from './view';

export const generateMetadata = async (props: NotificationPageParamsProps, parent: ResolvingMetadata) => {
    const { id, notificationId } = await props.params;

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildNotificationData = getGuildNotification(id, notificationId);

    const [user, guild, guildNotification] = await Promise.all([userData, guildData, guildNotificationData]);

    if (!user || !guild || !guildNotification)
        return parent;

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return parent;

    const metadata = await parent;
    return {
        ...metadata,
        title: guildNotification.title,
        openGraph: {
            ...metadata.openGraph,
            title: guildNotification.title
        },
        twitter: {
            ...metadata.twitter,
            title: guildNotification.title
        }
    };
};
const Page = async (props: NotificationPageParamsProps) => {
    const { id, notificationId } = await props.params;

    const localization = await getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildNotificationData = getGuildNotification(id, notificationId);

    const [user, guild, guildNotification] = await Promise.all([
        userData,
        guildData,
        guildNotificationData
    ]);

    if (!guild || !guildNotification)
        return (<NotFoundView />);

    if (user)
        await setGuildNotificationRead(guild.id, guildNotification.id, user.id, true);

    return (<View guild={guild} notification={guildNotification} localization={localization} />);
};

export default Page;
