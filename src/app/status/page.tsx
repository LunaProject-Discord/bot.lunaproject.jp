import { getGuilds, getUser } from '@/app/utils';
import { getAndRequestUserGuildsById, getStatuses } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { sortGuilds } from '@/utils/discord';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { NotFoundView, View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = await getLocalization();
    const title = translations.status;
    const description = translations.status_description;

    const metadata = await parent;
    return {
        ...metadata,
        title,
        description,
        openGraph: {
            ...metadata.openGraph,
            title,
            description
        },
        twitter: {
            ...metadata.twitter,
            title,
            description
        }
    };
};

const Page = async () => {
    const localization = await getLocalization();

    const userData = getUser();
    const guildsData = getGuilds();
    const statusesData = getStatuses();

    const [user, guilds, statuses] = await Promise.all([userData, guildsData, statusesData]);

    if (statuses.length < 1)
        return (<NotFoundView localization={localization} />);

    const mutualGuilds = user ? await getAndRequestUserGuildsById(user.id) : [];
    const mutualGuildIds = mutualGuilds.map((mutualGuild) => mutualGuild.id);
    const sortedGuilds = sortGuilds(guilds.filter((guild) => mutualGuildIds.includes(guild.id)));

    return (
        <View
            statuses={statuses}
            user={user}
            guilds={sortedGuilds}
            localization={localization}
        />
    );
};

export default Page;
