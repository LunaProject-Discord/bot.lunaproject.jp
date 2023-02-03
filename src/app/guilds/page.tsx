import { hasPermission, sortOAuthGuilds } from '../../utils/discord';
import { getGuilds, getMutualGuilds } from '../utils';
import { View } from './view';

const Page = async () => {
    const guildList = getGuilds();
    const mutualGuildList = getMutualGuilds();

    const [guilds, mutualGuilds] = await Promise.all([guildList, mutualGuildList]);

    const sortedGuilds = sortOAuthGuilds(guilds.filter((guild) => hasPermission(guild)));

    return (<View guilds={sortedGuilds} mutualGuilds={mutualGuilds.map((mutualGuild) => mutualGuild.id)} />);
};

export default Page;
