import { GuildMember } from '@lunaproject-discord/web-discord/dist/interfaces/discord';

export * from '@lunaproject-discord/web-discord/dist/utils';

export const filterPredicateMember = (member: GuildMember, keyword: string) => keyword.length < 1 || member.user.id.includes(keyword) || member.user.username.toLowerCase().includes(keyword.toLowerCase()) || member.user.discriminator.includes(keyword) || member.nick?.toLowerCase().includes(keyword.toLowerCase());
