import { getGuildById, hasPermission } from '@lunaproject-discord/web-discord';
import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { GuildSettings } from '../../../../interfaces/bot';
import { getGuildSettings } from '../../../../libs/bot';
import prisma from '../../../../libs/prisma';

type valueOf<T> = T[keyof T];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;

    const guild = await getGuildById(id, req.cookies['token']);
    if (!guild)
        return res.status(404).json({ message: 'Guild not found!' });

    switch (req.method) {
        case 'GET':
            return res.status(200).json(await getGuildSettings(id));
        case 'PATCH':
            if (!hasPermission(guild))
                return res.status(403).json({ message: 'Permission denied!' });

            const data: Partial<GuildSettings> = JSON.parse(req.body);
            delete data.id;

            try {
                const guildId = BigInt(id);
                await prisma.$transaction(async (prisma) => {
                    if (data.prefix) {
                        await prisma.guilds.update({
                            where: {
                                id: guildId
                            },
                            data: {
                                prefix: data.prefix
                            }
                        });
                        delete data.prefix;
                    }

                    if (Object.keys(data).length > 0) {
                        const inputs: { [key: string]: valueOf<Prisma.XOR<Prisma.guilds_settingsUpdateInput, Prisma.guilds_settingsUncheckedUpdateInput>> } = {};

                        const settings: { [key: string]: valueOf<GuildSettings> } = data;
                        for (const key in settings) {
                            const value = settings[key];
                            inputs[key] = typeof value === 'object' ? JSON.stringify(value) : value;
                        }

                        await prisma.guilds_settings.update({
                            where: {
                                id: guildId
                            },
                            data: inputs
                        });
                    }
                });

                await fetch(
                    `${process.env.NEXT_PUBLIC_BOT_API_ORIGIN}/v2/guilds/${id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOT_API_TOKEN}`
                        }
                    }
                );

                return res.status(200).json(await getGuildSettings(id));
            } catch (e) {
                console.error(e);
                return res.status(500).json({ message: 'Internal server error!' });
            }
        default:
            return res.status(405).json({ message: 'Method not allowed!' });
    }
};

export default handler;
