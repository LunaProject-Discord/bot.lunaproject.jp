import { getGuildById, hasPermission } from '@lunaproject-discord/web-discord';
import { NextApiRequest, NextApiResponse } from 'next';
import { PartialGuildLevel } from '../../../../interfaces/bot';
import { getGuildLevels, getGuildSettings } from '../../../../libs/bot';
import prisma from '../../../../libs/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const after = parseInt(req.query.after as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 100;
    const id = req.query.id as string;

    const guild = await getGuildById(id, req.cookies['token']);
    if (!guild)
        return res.status(404).json({ message: 'Guild not found!' });

    const guildSettings = await getGuildSettings(id);
    switch (req.method) {
        case 'GET':
            if (!hasPermission(guild) || !guildSettings?.level.leaderboard.public)
                return res.status(403).json({ message: 'Permission denied!' });

            return res.status(200).json(await getGuildLevels(id));
        case 'PATCH':
            if (!hasPermission(guild) || !guildSettings?.level.enabled)
                return res.status(403).json({ message: 'Permission denied!' });

            const data: PartialGuildLevel[] = JSON.parse(req.body);

            const counts = await prisma.$transaction(data.map((level) => prisma.$executeRaw`
                UPDATE \`guilds_levels\`
                SET \`level\` = ${level.level},
                    \`xp\`    = ${level.xp}
                WHERE \`guild_id\` = ${BigInt(id)}
                  AND \`user_id\` = ${BigInt(level.user_id)}
            `));
            const count = counts.reduce((sum, count) => sum + count, 0);

            return res.status(count > 0 ? 200 : 204).send({ count });
    }
};

export default handler;
