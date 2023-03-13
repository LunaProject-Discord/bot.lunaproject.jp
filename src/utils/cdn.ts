import { DataGuild, RedisGuild, RedisMember, RedisUser } from '../interfaces/redis';

export const CDN_BASE_URL = 'https://cdn.discordapp.com';

type CdnImageFormat = 'jpg' | 'png' | 'gif' | 'webp';

export const buildCdnUrl = (path: string, size?: number, format?: CdnImageFormat) => new URL(
    `${path}${format ? `.${format}` : ''}${size ? `?size=${size}` : ''}`,
    CDN_BASE_URL
).toString();

export const getUserAvatar = (user: RedisUser, size?: number, format?: CdnImageFormat) => user.avatar ? buildCdnUrl(
    `/avatars/${user.id}/${user.avatar}`,
    size,
    format
) : buildCdnUrl(
    `/embed/avatars/${Number(user.discriminator) % 5}`,
    undefined,
    'png'
);

export const getGuildIcon = (guild: RedisGuild | DataGuild, size?: number, format?: CdnImageFormat) => guild.icon ? buildCdnUrl(
    `/icons/${guild.id}/${guild.icon}`,
    size,
    format
) : buildCdnUrl(
    '/embed/avatars/0',
    undefined,
    'png'
);

export const getMemberAvatar = (member: RedisMember, guild: RedisGuild | DataGuild, size?: number, format?: CdnImageFormat) => member.avatar ? buildCdnUrl(
    `/guilds/${guild.id}/users/${member.id}/avatars/${member.avatar}.png`,
    size,
    format
) : getUserAvatar(
    member.user,
    size,
    format
);
