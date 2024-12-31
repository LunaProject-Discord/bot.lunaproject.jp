import { NotFoundView } from '@/app/guilds/[id]/view';
import { ArticlePageParamsProps } from '@/interfaces/page';
import { getGuildConfiguration, getGuildWebPage } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { View } from './view';

const Page = async ({ params: { id, slug } }: ArticlePageParamsProps) => {
    if (!/^\d+$/.test(id))
        return notFound();

    const localization = getLocalization();

    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);
    const guildWebPageData = getGuildWebPage(slug);

    const [guild, guildConfiguration, guildWebPage] = await Promise.all([guildData, guildConfigurationData, guildWebPageData]);

    if (!guild || !guildConfiguration || !guildWebPage)
        return (<NotFoundView localization={localization} />);

    return (<View guild={guild} page={guildWebPage} localization={localization} />);
};

export default Page;
