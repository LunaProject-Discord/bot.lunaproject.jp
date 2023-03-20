import { hasPermission } from '@lunaproject-discord/web-discord/dist/utils';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { getTranslation } from '../../languages/server';
import { getAndRequestUserGuildListById } from '../../libs/redis';
import { sortOAuthGuilds } from '../../utils/discord';
import { getGuilds, getUser } from '../utils';
import { UnauthorizedView } from '../view';
import { View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const translations = getTranslation();

    const metadata = await parent;
    return {
        ...metadata,
        title: translations.server_settings,
        openGraph: {
            ...metadata.openGraph,
            title: translations.server_settings
        },
        twitter: {
            ...metadata.twitter,
            title: translations.server_settings
        }
    };
};

const Page = async () => {
    const translations = getTranslation();

    const userData = getUser();
    const guildList = getGuilds();

    const [user, guilds] = await Promise.all([userData, guildList]);

    if (!user)
        return (<UnauthorizedView translations={translations} />);

    const mutualGuilds = await getAndRequestUserGuildListById(user.id);

    const sortedGuilds = sortOAuthGuilds(guilds.filter((guild) => hasPermission(guild)));

    return (
        <View
            guilds={sortedGuilds}
            mutualGuilds={mutualGuilds.map((mutualGuild) => mutualGuild.id)}
            translations={translations}
        />
    );
};

export default Page;
