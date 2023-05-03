import { Cache, OAuthGuild } from '@lunaproject-discord/web-discord';
import { addSeconds } from 'date-fns';
import { GuildLevel, GuildNotification, GuildSettings, GuildSettingsLanguage, PartialUser } from '../interfaces/bot';
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
        `${process.env.NEXT_PUBLIC_BOT_API_ORIGIN}/v2/users/${id}/guilds`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOT_API_TOKEN}`
            }
        }
    );

    console.log(res.ok, res.status);

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


export const getGuildNotifications = async (id: string): Promise<GuildNotification[]> => {
    const guildId = BigInt(id);
    const guildNotifications = await prisma.guilds_notifications.findMany({
        where: {
            guild_id: guildId
        }
    });

    const notifications: GuildNotification[] = [];
    for (const notification of guildNotifications) {
        const reads = await prisma.guilds_notifications_reads.findMany({
            where: {
                id: notification.id,
                guild_id: guildId
            }
        });

        notifications.push({
            id: notification.id,
            name: notification.name,
            type: notification.type,
            title: notification.title,
            description: notification.description,
            reads: reads.map((read) => read.user_id.toString()),
            updatedAt: notification.updated_at.getTime(),
            createdAt: notification.created_at.getTime()
        });
    }

    return notifications;
};

export const getGuildNotificationById = async (id: number): Promise<GuildNotification | undefined> => {
    const notification = await prisma.guilds_notifications.findUnique({
        where: {
            id: id
        }
    });

    if (!notification)
        return undefined;

    const reads = await prisma.guilds_notifications_reads.findMany({
        where: {
            id: notification.id,
            guild_id: notification.guild_id
        }
    });

    return {
        id: notification.id,
        name: notification.name,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        reads: reads.map((read) => read.user_id.toString()),
        updatedAt: notification.updated_at.getTime(),
        createdAt: notification.created_at.getTime()
    };
};

export const getGuildNotificationByName = async (id: string, name: string): Promise<GuildNotification | undefined> => {
    const guildId = BigInt(id);
    const notification = await prisma.guilds_notifications.findUnique({
        where: {
            guild_id_name: {
                guild_id: guildId,
                name: name
            }
        }
    });

    if (!notification)
        return undefined;

    const reads = await prisma.guilds_notifications_reads.findMany({
        where: {
            id: notification.id,
            guild_id: guildId
        }
    });

    return {
        id: notification.id,
        name: notification.name,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        reads: reads.map((read) => read.user_id.toString()),
        updatedAt: notification.updated_at.getTime(),
        createdAt: notification.created_at.getTime()
    };
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

export const getGuildLevels = async (id: string, isFetchUser: boolean = true): Promise<GuildLevel[]> => {
    const results: any[] = await prisma.$queryRaw`
        SELECT *, RANK() OVER(ORDER BY \`level\` DESC, \`xp\` DESC) AS \`rank\`
        FROM \`guilds_levels\`
        WHERE \`guild_id\` = ${id}
        ORDER BY \`rank\` ASC, \`user_id\` ASC
    `;

    const levels: GuildLevel[] = [];
    for (const level of results) {
        const userId = String(level.user_id);
        levels.push({
            user: isFetchUser ? await getUser(userId) : { id: userId },
            rank: Number(level.rank),
            level: Number(level.level),
            xp: Number(level.xp)
        });
    }

    return levels;
};
