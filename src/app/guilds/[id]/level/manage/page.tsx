import React from 'react';
import { WithIdParamProps } from '../../../../../interfaces/page';
import { getTranslation } from '../../../../../languages/server';
import { getGuildLevels, getGuildSettings } from '../../../../../libs/bot';
import { getGuildById } from '../../../../utils';
import { NotFoundView } from '../../view';
import { View } from './view';

const Page = async ({ params: { id } }: WithIdParamProps) => {
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildLevelsData = getGuildLevels(id);

    const guildSettingsData = getGuildSettings(id);

    const [guild, guildLevels, guildSettings] = await Promise.all([
        guildData,
        guildLevelsData,
        guildSettingsData
    ]);

    if (!guild || !guildLevels || !guildSettings)
        return (<NotFoundView />);

    return (
        <View
            guild={guild}
            levels={guildLevels}
            settings={guildSettings}
            translations={translations}
        />
    );
};

export default Page;
