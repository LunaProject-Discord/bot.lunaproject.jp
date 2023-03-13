import { APIGuildChannel } from '@lunaproject-discord/web-discord';
import { GuildMember } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { APIRole } from 'discord-api-types/v10';
import { DataGuild, RedisChannel, RedisGuild, RedisMember, RedisRole } from '../interfaces/redis';

export * from '@lunaproject-discord/web-discord/dist/utils';

export const hasPermission = (guild: RedisGuild | DataGuild, member: RedisMember, permission: number = 0x20) => guild.owner === member.id || (Number(member.permissions) & permission) === permission;

export const sortChannels = (channels: (APIGuildChannel | RedisChannel)[]) => (channels?.slice() ?? []).sort((a, b) => a.position - b.position);

export const sortRoles = (roles: (APIRole | RedisRole)[]) => (roles?.slice() ?? []).sort((a, b) => b.position - a.position);

export const filterPredicateChannel = (channel: APIGuildChannel | RedisChannel, keyword: string) => keyword.length < 1 || channel.id.includes(keyword) || channel.name.toLowerCase().includes(keyword.toLowerCase());

export const filterPredicateRole = (role: APIRole | RedisRole, keyword: string) => keyword.length < 1 || role.id.includes(keyword) || role.name.toLowerCase().includes(keyword.toLowerCase());

export const filterPredicateMember = (member: GuildMember | RedisMember, keyword: string) => keyword.length < 1 || member.user.id.includes(keyword) || ('username' in member.user ? member.user.username : member.user.name).toLowerCase().includes(keyword.toLowerCase()) || member.user.discriminator.includes(keyword) || member.nick?.toLowerCase().includes(keyword.toLowerCase());
