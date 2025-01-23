import { database, Guild_Levels_With_Rank } from '@/database';
import { GuildLevel } from '@/interfaces/bot';
import { getMembers, getUsersByIds } from '@/libs/redis';
import { eq } from 'drizzle-orm';

export const getGuildLevels = async (id: string): Promise<GuildLevel[]> => {
    const guildLevels = await database
        .select()
        .from(Guild_Levels_With_Rank)
        .where(eq(Guild_Levels_With_Rank.guildId, BigInt(id)));

    if (guildLevels.length < 1)
        return [];

    const users = await getUsersByIds(guildLevels.map((guildLevel) => String(guildLevel.userId)));
    const members = await getMembers(id);

    const levels: GuildLevel[] = [];
    for (const guildLevel of guildLevels) {
        const userId = String(guildLevel.userId);

        levels.push({
            user: users.find((user) => user.id === userId) ?? { id: userId },
            member: members.find((member) => member.user.id === userId),
            rank: guildLevel.rank,
            level: guildLevel.level,
            experience: guildLevel.experience
        });
    }

    return levels;
};
