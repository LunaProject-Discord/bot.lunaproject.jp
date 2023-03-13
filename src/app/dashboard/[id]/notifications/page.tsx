import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { WithIdParamProps } from '../../../../interfaces/page';
import { getTranslation } from '../../../../languages/server';
import { getGuildNotifications } from '../../../../libs/bot';
import { getGuildById, getMemberById } from '../../../../libs/redis';
import { hasPermission } from '../../../../utils/discord';
import { getUser } from '../../../utils';
import { NotFoundView } from '../view';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const translations = getTranslation();
    const title = translations.notifications;

    const user = await getUser();
    const guild = await getGuildById(id);
    if (!user || !guild)
        return parent;

    const member = await getMemberById(user.id, guild.id);
    if (!member || !hasPermission(guild, member))
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

const Page = async ({ params: { id } }: WithIdParamProps) => {
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildNotificationsData = getGuildNotifications(id);

    const [guild, guildNotifications] = await Promise.all([guildData, guildNotificationsData]);

    if (!guild || !guildNotifications)
        return (<NotFoundView />);

    return (
        <View
            guild={guild}
            notifications={guildNotifications}
            translations={translations}
        />
    );
};

export default Page;
