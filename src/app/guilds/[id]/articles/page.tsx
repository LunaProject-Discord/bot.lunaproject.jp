import { NotFoundView } from '@/app/guilds/[id]/view';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildConfiguration } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: GenericPageParamsProps, parent: ResolvingMetadata) => {
    const { id } = await props.params;

    const { translations } = await getLocalization();
    const title = translations.web_pages;

    const guild = await getGuildById(id);
    if (!guild)
        return parent;

    const metadata = await parent;
    return {
        ...metadata,
        title,
        openGraph: {
            ...metadata.openGraph,
            title
        },
        twitter: {
            ...metadata.twitter,
            title
        }
    };
};

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
