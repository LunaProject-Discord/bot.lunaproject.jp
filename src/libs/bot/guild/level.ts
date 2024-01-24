import { GuildLevel } from '@interfaces/bot';
import prisma from '@libs/prisma';
import { getMembers, getUsersByIds } from '@libs/redis';

export const getGuildLevels = async (id: string): Promise<GuildLevel[]> => {
    const guildLevels = await prisma.guild_levels_with_rank.findMany({
        where: {
            guild_id: BigInt(id)
        }
    });

    const users = await getUsersByIds(guildLevels.map((guildLevel) => String(guildLevel.user_id)));
    const members = await getMembers(id);

    const levels: GuildLevel[] = [];
    for (const guildLevel of guildLevels) {
        const userId = String(guildLevel.user_id);

        levels.push({
            user: users.find((user) => user.id === userId) ?? { id: userId },
            member: members.find((member) => member.user.id === userId),
            rank: Number(guildLevel.rank),
            level: Number(guildLevel.level),
            experience: Number(guildLevel.experience)
        });
    }

    return levels;
};
