import { getUser } from '@/app/utils';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildConfiguration, getGuildLevels, isLeaderboardAccessible } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { NotFoundView, View } from './view';

export const generateMetadata = async (props: GenericPageParamsProps, parent: ResolvingMetadata) => {
    const { id } = await props.params;

    const { translations } = await getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildConfiguration] = await Promise.all([userData, guildData, guildConfigurationData]);

    if (!guild || !guildConfiguration)
        return parent;

    const isAccessible = await isLeaderboardAccessible(user, guild, guildConfiguration);
    if (!isAccessible)
        return parent;

    const title = `${translations.leaderboard} [${guild.name}]`;
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

    if (!/^\d+$/.test(id))
        return notFound();

    const localization = await getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildLevelsData = getGuildLevels(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildLevels, guildConfiguration] = await Promise.all([userData, guildData, guildLevelsData, guildConfigurationData]);

    if (!guild || !guildConfiguration)
        return (<NotFoundView localization={localization} />);

    const isAccessible = await isLeaderboardAccessible(user, guild, guildConfiguration);
    if (!isAccessible)
        return (<NotFoundView localization={localization} />);

    return (
        <View
            guild={guild}
            levels={guildLevels}
            configuration={guildConfiguration}
            localization={localization}
        />
    );
};

export default Page;
