import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildConfiguration } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import React from 'react';
import { NotFoundView, View } from './view';

const Page = async (props: GenericPageParamsProps) => {
    const { id } = await props.params;

    const localization = await getLocalization();

    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [guild, guildConfiguration] = await Promise.all([guildData, guildConfigurationData]);

    if (!guild || !guildConfiguration)
        return (<NotFoundView localization={localization} />);

    return (<View guild={guild} localization={localization} />);
};

export default Page;
