import React from 'react';
import { WithIdParamProps } from '../../../interfaces/page';
import { getTranslation } from '../../../languages/server';
import { getGuildNotifications } from '../../../libs/bot';
import { getGuildById } from '../../../libs/redis';
import { getUser } from '../../utils';
import { NotFoundView, View } from './view';

const Page = async ({ params: { id } }: WithIdParamProps) => {
    const translations = getTranslation();

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
            translations={translations}
        />
    );
};

export default Page;
