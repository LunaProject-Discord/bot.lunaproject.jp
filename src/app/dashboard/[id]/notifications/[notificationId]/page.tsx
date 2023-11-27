import { getUser } from '@app/utils';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildNotificationById, setGuildNotificationRead } from '@libs/bot';
import { getGuildById, getMemberById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckMemberPermissions } from '@utils/discord';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { NotFoundView } from '../../view';
import { View } from './view';

interface Props extends WithIdParamProps {
    params: {
        id: string;
        notificationId: string;
    };
}

export const generateMetadata = async ({ params: { id, notificationId } }: Props, parent: ResolvingMetadata) => {
    const userData = getUser();
    const guildData = getGuildById(id);
    const guildNotificationData = getGuildNotificationById(id, notificationId);

    const [user, guild, guildNotification] = await Promise.all([userData, guildData, guildNotificationData]);

    if (!user || !guild || !guildNotification)
        return parent;

    const member = await getMemberById(user.id, guild.id);
    if (!member || !someCheckMemberPermissions(guild, member, ...ADMINISTRATOR_OR_MANAGE_GUILD))
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
const Page = async ({ params: { id, notificationId } }: Props) => {
    const localization = getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildNotificationData = getGuildNotificationById(id, notificationId);

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
