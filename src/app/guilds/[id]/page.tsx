import { getUser } from '@app/utils';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration } from '@libs/bot';
import { getGuildById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { NotFoundView, View } from './view';

const Page = async ({ params: { id } }: WithIdParamProps) => {
    if (!/^\d+$/.test(id))
        return notFound();

    const localization = getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildConfiguration] = await Promise.all([
        userData,
        guildData,
        guildConfigurationData
    ]);

    if (!guild || !guildConfiguration)
        return (<NotFoundView localization={localization} />);

    return (<View guild={guild} localization={localization} />);
};

export default Page;
