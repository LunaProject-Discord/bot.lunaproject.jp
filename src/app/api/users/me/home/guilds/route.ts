import { sortOAuthGuilds } from '@lunaproject-discord/web-discord';
import { NextResponse } from 'next/server';
import { FeaturedGuild, GuildFeature } from '../../../../../../interfaces/bot';
import { getGuildSettings } from '../../../../../../libs/bot';
import { getAndRequestUserGuildsById } from '../../../../../../libs/redis';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions } from '../../../../../../utils/discord';
import { getGuilds, getUser } from '../../../../../utils';

export const GET = async (req: Request) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guilds = await getGuilds();
    const mutualGuilds = await getAndRequestUserGuildsById(user.id);
    const mutualGuildIds = mutualGuilds.map((guild) => guild.id);

    const sortedGuilds = sortOAuthGuilds(guilds);
    const filteredGuilds = sortedGuilds.filter((guild) => mutualGuildIds.includes(guild.id));

    const featuredGuilds: FeaturedGuild[] = [];
    for (const guild of filteredGuilds) {
        const features: GuildFeature[] = [];

        if (someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))
            features.push('manage');

        const guildSettings = await getGuildSettings(guild.id);

        if (guildSettings?.level.enabled)
            features.push('level');

        featuredGuilds.push({ guild, features });
    }

    return NextResponse.json(featuredGuilds, { status: 200 });
};
