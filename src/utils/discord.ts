import { DataGuild, RedisChannel, RedisGuild, RedisMember, RedisRole, RedisUser } from '@interfaces/redis';
import {
    APIGuildChannel,
    GuildMember,
    OAuthGuild,
    OAuthUser
} from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { APIGuild, APIRole, APIUser, PermissionFlagsBits } from 'discord-api-types/v10';

export * from '@lunaproject-discord/web-discord/dist/utils';

export const ADMINISTRATOR_OR_MANAGE_GUILD = [PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageGuild];

export const checkPermission = (permissions: string | bigint | undefined, permission: bigint) => (BigInt(permissions ?? 0) & permission) === permission;

export const someCheckMemberPermissions = (guild: RedisGuild | DataGuild, member: RedisMember, ...permissions: bigint[]) => guild.owner === member.id || permissions.some((permission) => checkPermission(member.permissions, permission));

export const everyCheckMemberPermissions = (guild: RedisGuild | DataGuild, member: RedisMember, ...permissions: bigint[]) => guild.owner === member.id || permissions.every((permission) => checkPermission(member.permissions, permission));


export const getUserDisplayName = (user: OAuthUser | APIUser | RedisUser) => 'username' in user ? (user.global_name ?? user.username) : (user.display_name ?? user.name);

export const getMemberDisplayName = (member: GuildMember | RedisMember) => member.nick ?? getUserDisplayName(member.user);

export const getUserDisplay = (user: OAuthUser | APIUser | RedisUser): [string, string | undefined] => {
    const name = 'username' in user ? user.username : user.name;
    const displayName = ('username' in user ? user.global_name : user.display_name) ?? undefined;
    const isTransferCompleted = Number(user.discriminator) === 0;

    if (isTransferCompleted) {
        return [getUserDisplayName(user), `@${name}`];
    } else {
        const tag = `${name}#${user.discriminator}`;
        return [displayName && displayName !== name ? displayName : tag, displayName ? tag : undefined];
    }
};

export const getMemberDisplay = (member: GuildMember | RedisMember): [string, string | undefined] => {
    const name = 'username' in member.user ? member.user.username : member.user.name;
    const isTransferCompleted = Number(member.user.discriminator) === 0;

    const nick = member.nick ?? undefined;

    if (nick) {
        const tag = `${name}#${member.user.discriminator}`;
        return [nick, isTransferCompleted ? `@${name}` : tag];
    } else {
        return getUserDisplay(member.user);
    }
};


export const getRoleColor = (role: APIRole | RedisRole) => {
    const hexColor = role.color.toString(16).padStart(6, '0');
    return `#${hexColor !== '1fffffff' ? hexColor : '99aab5'}`;
};


export const sortGuilds = <T extends OAuthGuild | APIGuild | RedisGuild>(guilds: T[]) => (guilds?.slice() ?? []).sort((a, b) => a.name.localeCompare(b.name));

export const sortChannels = <T extends APIGuildChannel | RedisChannel>(channels: T[]) => (channels?.slice() ?? []).sort((a, b) => a.position - b.position);

export const sortRoles = <T extends APIRole | RedisRole>(roles: T[]) => (roles?.slice() ?? []).sort((a, b) => b.position - a.position);

export const sortMembers = <T extends GuildMember | RedisMember>(members: T[]) => (members?.slice() ?? []).sort((a, b) => (getMemberDisplayName(a)).localeCompare(getMemberDisplayName(b)));


export const filterPredicateGuild = (guild: OAuthGuild | APIGuild | RedisGuild, keyword: string) => keyword.length < 1
    || guild.id.includes(keyword)
    || guild.name.toLowerCase().includes(keyword.toLowerCase());

export const filterPredicateChannel = (channel: APIGuildChannel | RedisChannel, keyword: string) => keyword.length < 1
    || channel.id.includes(keyword)
    || channel.name.toLowerCase().includes(keyword.toLowerCase());

export const filterPredicateRole = (role: APIRole | RedisRole, keyword: string) => keyword.length < 1
    || role.id.includes(keyword)
    || role.name.toLowerCase().includes(keyword.toLowerCase());

export const filterPredicateMember = (member: GuildMember | RedisMember, keyword: string) => keyword.length < 1
    || member.user.id.includes(keyword)
    || ('username' in member.user ? member.user.username : member.user.name).toLowerCase().includes(keyword.toLowerCase())
    || ('global_name' in member.user ? member.user.global_name : member.user.display_name)?.toLowerCase().includes(keyword.toLowerCase())
    || member.user.discriminator.includes(keyword)
    || member.nick?.toLowerCase().includes(keyword.toLowerCase());
