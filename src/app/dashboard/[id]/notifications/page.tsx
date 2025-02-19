import { NotFoundView } from '@/app/dashboard/[id]/view';
import { getUser } from '@/app/utils';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildNotifications, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: GenericPageParamsProps, parent: ResolvingMetadata) => {
    const { id } = await props.params;

    const { translations } = await getLocalization();
    const title = translations.notifications;

    const user = await getUser();
    const guild = await getGuildById(id);
    if (!user || !guild)
        return parent;

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return parent;

    const metadata = await parent;
    return {
        ...metadata,
        title,
        openGraph: {
            ...metadata.openGraph,
            title
        },
        twitter: {
            ...metadata.twitter,
            title
        }
    };
};

const Page = async (props: GenericPageParamsProps) => {
    const { id } = await props.params;

    const localization = await getLocalization();

    const guildData = getGuildById(id);
    const guildNotificationsData = getGuildNotifications(id);

    const [guild, guildNotifications] = await Promise.all([guildData, guildNotificationsData]);

    if (!guild || !guildNotifications)
        return (<NotFoundView />);

    return (<View guild={guild} notifications={guildNotifications} localization={localization} />);
};

export default Page;
