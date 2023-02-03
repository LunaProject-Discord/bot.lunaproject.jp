import { addSeconds } from 'date-fns';
import { GuildLevel, GuildSettings, GuildSettingsLanguage, PartialUser } from '../interfaces/bot';
import { Cache } from '../interfaces/cache';
import { OAuthGuild } from '../interfaces/discord';
import { TimeZone } from '../utils/timezone';
import prisma from './prisma';

export const getUser = async (id: string): Promise<PartialUser> => {
    const result = await prisma.users_profiles.findUnique({
        where: {
            id: BigInt(id)
        }
    });

    if (!result)
        return { id };

    return {
        id: id,
        name: result.name,
        discriminator: result.discriminator,
        avatar: result.avatar_url
    };
};

export const cachedMutualGuilds = new Map<string, Cache<OAuthGuild[]>>();

export const getMutualGuilds = async (id: string): Promise<OAuthGuild[]> => {
    const date = new Date();

    const cached = cachedMutualGuilds.get(id);
    if (cached && cached.expired_at > date.getTime())
        return cached.data;

    const res = await fetch(
        `https://yudzuki-api.lunaproject.jp/v2/users/${id}/guilds`,
        {
            headers: {
                Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6Ill1ZHp1a2lCb3QiLCJpZCI6NTUzODQxMTk0Njk5MDYzMzE5LCJzZWNyZXQiOiJ6d012aFBXVWQ1dXdFbmFwQ1VHclhZRW5oVXpKUFFld0FhNHBXbkxMRjFObTA4ZFZFbmg4OGs3cjVCWjZNNDNFIn0.FN0sFTf4ntGbUU-hxHYuV0StpzoAHHfW2TkddHKerT4`
            }
        }
    );

    if (!res.ok)
        return cached?.data ?? [];

    const data: OAuthGuild[] = await res.json();
    cachedMutualGuilds.set(
        id,
        {
            data,
            expired_at: addSeconds(date, 60).getTime()
        }
    );

    return data;
};

export const getGuildSettings = async (id: string): Promise<GuildSettings | undefined> => {
    const guildId = BigInt(id);
    const guildData = await prisma.guilds.findUnique({
        where: {
            id: guildId
        }
    });
    const guildSettingsData = await prisma.guilds_settings.findUnique({
        where: {
            id: guildId
        }
    });

    if (!guildData || !guildSettingsData)
        return undefined;

    return {
        id: id,
        prefix: guildData.prefix,
        nickname: guildSettingsData.nickname,
        language: guildSettingsData.language as GuildSettingsLanguage,
        timezone: guildSettingsData.timezone as TimeZone,
        commands: JSON.parse(guildSettingsData.commands),
        welcome: JSON.parse(guildSettingsData.welcome),
        goodbye: JSON.parse(guildSettingsData.goodbye),
        activity: JSON.parse(guildSettingsData.activity),
        global_chat: JSON.parse(guildSettingsData.global_chat),
        global_ban: JSON.parse(guildSettingsData.global_ban),
        level: JSON.parse(guildSettingsData.level),
        translate: JSON.parse(guildSettingsData.translate),
        vote: JSON.parse(guildSettingsData.vote),
        quote: JSON.parse(guildSettingsData.quote),
        music: JSON.parse(guildSettingsData.music),
        logging: JSON.parse(guildSettingsData.logging)
    };
};

export const getGuildLevels = async (id: string): Promise<GuildLevel[]> => {
    const results: any[] = await prisma.$queryRaw`
        SELECT *, RANK() OVER(ORDER BY \`level\` DESC, \`xp\` DESC) AS \`rank\`
        FROM \`guilds_levels\`
        WHERE \`guild_id\` = ${id}
        ORDER BY \`rank\` ASC, \`user_id\` ASC
    `;

    const levels: GuildLevel[] = [];
    for (const level of results) {
        levels.push({
            user: await getUser(String(level.user_id)),
            rank: Number(level.rank),
            level: Number(level.level),
            xp: Number(level.xp)
        });
    }

    return levels;
};
