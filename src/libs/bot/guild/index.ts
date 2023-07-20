import { GuildFlags } from '@interfaces/bot';
import prisma from '@libs/prisma';

export const getGuildFlags = async (id: string): Promise<GuildFlags | undefined> => {
    const guildData = await prisma.guilds.findUnique({ where: { id: BigInt(id) } });
    if (!guildData)
        return undefined;

    const flags = guildData ? JSON.parse(guildData.flags) : {};
    return {
        id,
        verified: flags.verified,
        partner: flags.partner,
        tester: flags.tester
    };
};


export * from './configuration';
export * from './level';
export * from './notification';
