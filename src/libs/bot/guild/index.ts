import { database, Guilds } from '@/database';
import { GuildConfiguration, GuildFlags } from '@/interfaces/bot';
import { DataGuild, RedisMember } from '@/interfaces/redis';
import { getUserPermission } from '@/libs/bot';
import { getMemberById } from '@/libs/redis';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckMemberPermissions } from '@/utils/discord';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { eq } from 'drizzle-orm';

export const hasDashboardAccessUserPermission = async (user: OAuthUser): Promise<boolean> => {
    const permission = await getUserPermission(user.id);
    return ['owner', 'sub_owner', 'admin'].includes(permission);
};

export const hasDashboardAccessMemberPermission = (guild: DataGuild, member: RedisMember) => someCheckMemberPermissions(guild, member, ...ADMINISTRATOR_OR_MANAGE_GUILD);

export const hasDashboardAccess = async (guild: DataGuild, user: OAuthUser | undefined): Promise<boolean> => {
    if (!user)
        return false;

    const isManager = await hasDashboardAccessUserPermission(user);
    if (isManager)
        return true;

    const member = await getMemberById(user.id, guild.id);
    if (member)
        return hasDashboardAccessMemberPermission(guild, member);

    return false;
};

export const isLeaderboardAccessible = async (user: OAuthUser | undefined, guild: DataGuild, guildConfiguration: GuildConfiguration): Promise<boolean> => {
    const levelConfiguration = guildConfiguration.level;
    const levelLeaderboardConfiguration = levelConfiguration.leaderboard;
    if (!levelConfiguration.enabled)
        return false;

    if (levelLeaderboardConfiguration.public)
        return true;

    if (!user)
        return false;

    const member = await getMemberById(user.id, guild.id);
    return member !== undefined;
};

export const getGuildFlags = async (id: string): Promise<GuildFlags | undefined> => {
    const guild = await database.query.Guilds.findFirst({
        where: eq(Guilds.id, BigInt(id)),
        columns: {
            flags: true
        }
    });
    if (!guild)
        return undefined;

    const flags = guild.flags;
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
export * from './web';
