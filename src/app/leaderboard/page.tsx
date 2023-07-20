import { getGuildConfiguration } from '@libs/bot';
import { getAndRequestUserGuildsById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { OAuthGuild } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { sortGuilds } from '@utils/discord';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { NextResponse } from 'next/server';
import React from 'react';
import { getGuilds, getUser } from '../utils';
import { View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.leaderboard;

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

const Page = async () => {
    const localization = getLocalization();

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guildsData = getGuilds();
    const mutualGuildsData = getAndRequestUserGuildsById(user.id);
    const [guilds, mutualGuilds] = await Promise.all([guildsData, mutualGuildsData]);

    const mutualGuildIds = mutualGuilds.map((guild) => guild.id);
    const filteredGuilds = guilds.filter((guild) => mutualGuildIds.includes(guild.id));

    const levelEnabledGuilds: OAuthGuild[] = [];
    for (const guild of filteredGuilds) {
        const guildConfiguration = await getGuildConfiguration(guild.id);
        if (guildConfiguration?.level.enabled)
            levelEnabledGuilds.push(guild);
    }

    const sortedGuilds = sortGuilds(levelEnabledGuilds);
    return (<View guilds={sortedGuilds} localization={localization} />);
};

export default Page;
