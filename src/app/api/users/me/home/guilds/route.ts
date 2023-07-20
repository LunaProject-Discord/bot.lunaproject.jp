import { getGuilds, getUser } from '@app/utils';
import { FeaturedGuild, GuildFeature } from '@interfaces/bot';
import { getGuildConfiguration } from '@libs/bot';
import { getAndRequestUserGuildsById } from '@libs/redis';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions, sortGuilds } from '@utils/discord';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guilds = await getGuilds();
    const mutualGuilds = await getAndRequestUserGuildsById(user.id);
    const mutualGuildIds = mutualGuilds.map((guild) => guild.id);

    const sortedGuilds = sortGuilds(guilds);
    const filteredGuilds = sortedGuilds.filter((guild) => mutualGuildIds.includes(guild.id));

    const featuredGuilds: FeaturedGuild[] = [];
    for (const guild of filteredGuilds) {
        const features: GuildFeature[] = [];

        if (someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))
            features.push('manage');

        const guildConfiguration = await getGuildConfiguration(guild.id);
        if (guildConfiguration?.level.enabled)
            features.push('level');

        featuredGuilds.push({ guild, features });
    }

    return NextResponse.json(featuredGuilds, { status: 200 });
};
