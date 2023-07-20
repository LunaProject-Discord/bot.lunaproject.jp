import { GuildLevel } from '@interfaces/bot';
import { getUser } from '@libs/bot';
import prisma from '@libs/prisma';

export const getGuildLevels = async (id: string, isFetchUser: boolean = true): Promise<GuildLevel[]> => {
    const results: any[] = await prisma.$queryRaw`
        SELECT *, RANK() OVER(ORDER BY \`level\` DESC, \`xp\` DESC) AS \`rank\`
        FROM \`guilds_levels\`
        WHERE \`guild_id\` = ${id}
        ORDER BY \`rank\` ASC, \`user_id\` ASC
    `;

    const levels: GuildLevel[] = [];
    for (const level of results) {
        const userId = String(level.user_id);
        levels.push({
            user: isFetchUser ? await getUser(userId) : { id: userId },
            rank: Number(level.rank),
            level: Number(level.level),
            xp: Number(level.xp)
        });
    }

    return levels;
};
