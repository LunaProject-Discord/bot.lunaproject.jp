import { NextApiRequest, NextApiResponse } from 'next';
import { FeaturedGuild, GuildFeature } from '../../../../../interfaces/bot';
import { getGuildSettings, getMutualGuilds } from '../../../../../libs/bot';
import { getGuilds, getUser } from '../../../../../libs/discord';
import { hasPermission, sortOAuthGuilds } from '../../../../../utils/discord';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(405).json({ message: 'Method not allowed!' });

    const user = await getUser(req.cookies['token']);
    if (!user)
        return res.status(404).json({ message: 'User not found!' });

    const guilds = await getGuilds(req.cookies['token']);
    const mutualGuilds = await getMutualGuilds(user.id);
    const mutualGuildIds = mutualGuilds.map((guild) => guild.id);

    const sortedGuilds = sortOAuthGuilds(guilds);
    const filteredGuilds = sortedGuilds.filter((guild) => mutualGuildIds.includes(guild.id));

    const featuredGuilds: FeaturedGuild[] = [];
    for (const guild of filteredGuilds) {
        const features: GuildFeature[] = [];

        if (hasPermission(guild))
            features.push('manage');

        const guildSettings = await getGuildSettings(guild.id);

        if (guildSettings?.level.enabled)
            features.push('level');

        featuredGuilds.push({ guild, features });
    }

    return res.status(200).json(featuredGuilds);
};

export default handler;
