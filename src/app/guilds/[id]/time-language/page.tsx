import React from 'react';
import { WithIdParamProps } from '../../../../interfaces/page';
import { getTranslation } from '../../../../languages/server';
import { getGuildSettings } from '../../../../libs/bot';
import { getGuildById } from '../../../utils';
import { NotFoundView } from '../view';
import { View } from './view';

const Page = async ({ params: { id } }: WithIdParamProps) => {
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildSettingsData = getGuildSettings(id);

    const [guild, guildSettings] = await Promise.all([guildData, guildSettingsData]);

    if (!guild || !guildSettings)
        return (<NotFoundView />);

    return (<View guild={guild} settings={guildSettings} translations={translations} />);
};

export default Page;
