import { GuildFlags } from '@interfaces/bot';
import { DataGuild } from '@interfaces/redis';
import { getUserPermission } from '@libs/bot';
import prisma from '@libs/prisma';
import { getMemberById } from '@libs/redis';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckMemberPermissions } from '@utils/discord';

export const hasDashboardAccess = async (guild: DataGuild, user: OAuthUser): Promise<[boolean, boolean]> => {
    const member = await getMemberById(user.id, guild.id);
    if (member)
        return [someCheckMemberPermissions(guild, member, ...ADMINISTRATOR_OR_MANAGE_GUILD), false];

    const permission = await getUserPermission(user.id);
    if (['owner', 'sub_owner', 'admin'].includes(permission))
        return [true, true];

    return [false, false];
};

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
