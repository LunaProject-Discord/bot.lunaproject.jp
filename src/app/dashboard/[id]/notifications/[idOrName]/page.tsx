import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { WithIdParamProps } from '../../../../../interfaces/page';
import { getGuildNotificationById, getGuildNotificationByName } from '../../../../../libs/bot';
import { getGuildById, getMemberById } from '../../../../../libs/redis';
import { getLocalization } from '../../../../../localizations/server';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckMemberPermissions } from '../../../../../utils/discord';
import { getUser } from '../../../../utils';
import { NotFoundView } from '../../view';
import { View } from './view';

interface Props extends WithIdParamProps {
    params: {
        id: string;
        idOrName: string | number;
    };
}

export const generateMetadata = async ({ params: { id, idOrName } }: Props, parent: ResolvingMetadata) => {
    const userData = getUser();
    const guildData = getGuildById(id);
    const guildNotificationData = typeof idOrName === 'string' ? getGuildNotificationByName(id, idOrName) : getGuildNotificationById(idOrName);

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
const Page = async ({ params: { id, idOrName } }: Props) => {
    const localization = getLocalization();

    const guildData = getGuildById(id);
    const guildNotificationData = typeof idOrName === 'string' ? getGuildNotificationByName(id, idOrName) : getGuildNotificationById(idOrName);

    const [guild, guildNotification] = await Promise.all([guildData, guildNotificationData]);

    if (!guild || !guildNotification)
        return (<NotFoundView />);

    return (<View guild={guild} notification={guildNotification} localization={localization} />);
};

export default Page;
