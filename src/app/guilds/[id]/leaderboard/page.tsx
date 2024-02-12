import { NotFoundView } from '@app/guilds/[id]/view';
import { getUser } from '@app/utils';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration, getGuildLevels, isLeaderboardAccessible } from '@libs/bot';
import { getGuildById, getMemberById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { notFound } from 'next/navigation';
import React from 'react';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.leaderboard;

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildConfiguration] = await Promise.all([userData, guildData, guildConfigurationData]);
    if (!guild || !guildConfiguration)
        return parent;

    const isAccessible = await isLeaderboardAccessible(user, guild, guildConfiguration);
    if (!isAccessible)
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

const Page = async ({ params: { id } }: WithIdParamProps) => {
    if (!/^\d+$/.test(id))
        return notFound();

    const localization = getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildLevelsData = getGuildLevels(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildLevels, guildConfiguration] = await Promise.all([
        userData,
        guildData,
        guildLevelsData,
        guildConfigurationData
    ]);

    if (!guild || !guildConfiguration)
        return (<NotFoundView localization={localization} />);

    const member = user ? await getMemberById(user.id, guild.id) : undefined;
    const isAccessible = await isLeaderboardAccessible(user, guild, guildConfiguration);
    if (!isAccessible)
        return (<NotFoundView localization={localization} />);

    return (
        <View
            guild={guild}
            member={member}
            levels={guildLevels}
            configuration={guildConfiguration}
            localization={localization}
        />
    );
};

export default Page;
