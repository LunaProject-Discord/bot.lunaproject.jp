import React from 'react';
import { WithIdParamProps } from '../../../../interfaces/page';
import { getTranslation } from '../../../../languages/server';
import { getGuildSettings } from '../../../../libs/bot';
import { getGuildChannelsById, getGuildRolesById } from '../../../../libs/discord';
import { getGuildById } from '../../../utils';
import { NotFoundView } from '../view';
import { View } from './view';

const Page = async ({ params: { id } }: WithIdParamProps) => {
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildChannelsData = getGuildChannelsById(id);
    const guildRolesData = getGuildRolesById(id);

    const guildSettingsData = getGuildSettings(id);

    const [guild, guildChannels, guildRoles, guildSettings] = await Promise.all([
        guildData,
        guildChannelsData,
        guildRolesData,
        guildSettingsData
    ]);

    if (!guild || !guildChannels || !guildRoles || !guildSettings)
        return (<NotFoundView />);

    return (
        <View
            guild={guild}
            channels={guildChannels}
            roles={guildRoles}
            settings={guildSettings}
            translations={translations}
        />
    );
};

export default Page;
