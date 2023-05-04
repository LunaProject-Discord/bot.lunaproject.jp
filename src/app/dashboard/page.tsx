import { hasPermission } from '@lunaproject-discord/web-discord/dist/utils';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { getAndRequestUserGuildsById } from '../../libs/redis';
import { getLocalization } from '../../localizations/server';
import { sortOAuthGuilds } from '../../utils/discord';
import { getGuilds, getUser } from '../utils';
import { UnauthorizedView } from '../view';
import { View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.guild_settings;

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

    const userData = getUser();
    const guildsData = getGuilds();

    const [user, guilds] = await Promise.all([userData, guildsData]);

    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const mutualGuilds = await getAndRequestUserGuildsById(user.id);

    const sortedGuilds = sortOAuthGuilds(guilds.filter((guild) => hasPermission(guild)));

    return (
        <View
            guilds={sortedGuilds}
            mutualGuilds={mutualGuilds.map((mutualGuild) => mutualGuild.id)}
            localization={localization}
        />
    );
};

export default Page;
