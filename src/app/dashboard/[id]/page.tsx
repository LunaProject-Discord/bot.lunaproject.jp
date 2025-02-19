import { getUser } from '@/app/utils';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildNotifications } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import React from 'react';
import { NotFoundView, View } from './view';

const Page = async (props: GenericPageParamsProps) => {
    const { id } = await props.params;

    const localization = await getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildNotificationsData = getGuildNotifications(id);

    const [user, guild, guildNotifications] = await Promise.all([userData, guildData, guildNotificationsData]);

    if (!user || !guild)
        return (<NotFoundView />);

    return (
        <View
            user={user}
            guild={guild}
            notifications={guildNotifications}
            localization={localization}
        />
    );
};

export default Page;
