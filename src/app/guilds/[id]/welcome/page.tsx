import React from 'react';
import { WithIdParamProps } from '../../../../interfaces/page';
import { getTranslation } from '../../../../languages/server';
import { getGuildSettings } from '../../../../libs/bot';
import { getGuildChannelsById } from '../../../../libs/discord';
import { getGuildById } from '../../../utils';
import { NotFoundView } from '../view';
import { View } from './view';

const Page = async ({ params: { id } }: WithIdParamProps) => {
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildChannelsData = getGuildChannelsById(id);

    const guildSettingsData = getGuildSettings(id);

    const [guild, guildChannels, guildSettings] = await Promise.all([guildData, guildChannelsData, guildSettingsData]);

    if (!guild || !guildChannels || !guildSettings)
        return (<NotFoundView />);

    return (<View guild={guild} channels={guildChannels} settings={guildSettings} translations={translations} />);
};

export default Page;
