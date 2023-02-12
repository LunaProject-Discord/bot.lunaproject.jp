import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { getTranslation } from '../../languages/server';
import { hasPermission, sortOAuthGuilds } from '../../utils/discord';
import { getGuilds, getMutualGuilds } from '../utils';
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
    const guildList = getGuilds();
    const mutualGuildList = getMutualGuilds();

    const [guilds, mutualGuilds] = await Promise.all([guildList, mutualGuildList]);

    const sortedGuilds = sortOAuthGuilds(guilds.filter((guild) => hasPermission(guild)));

    return (<View guilds={sortedGuilds} mutualGuilds={mutualGuilds.map((mutualGuild) => mutualGuild.id)} />);
};

export default Page;
