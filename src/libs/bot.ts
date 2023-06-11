import {
    GuildConfiguration,
    GuildConfigurationLanguage,
    GuildLevel,
    GuildNotification,
    PartialUser,
    UserNotification
} from '@interfaces/bot';
import { Cache, OAuthGuild } from '@lunaproject-discord/web-discord';
import { TimeZone } from '@utils/timezone';
import { addSeconds } from 'date-fns';
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
        id,
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

export const getUserNotifications = async (id: string): Promise<UserNotification[]> => {
    const userNotifications = await prisma.users_notifications.findMany({
        where: {
            user_id: BigInt(id)
        }
    });

    const notifications: UserNotification[] = [];
    for (const notification of userNotifications) {
        notifications.push({
            id: notification.id,
            name: notification.name,
            type: notification.type,
            title: notification.title,
            description: notification.description,
            isRead: notification.is_read,
            updatedAt: notification.updated_at.getTime(),
            createdAt: notification.created_at.getTime()
        });
    }

    return notifications;
};

export const getUserNotificationById = async (id: number): Promise<UserNotification | undefined> => {
    const notification = await prisma.users_notifications.findUnique({
        where: {
            id
        }
    });

    if (!notification)
        return undefined;

    return {
        id: notification.id,
        name: notification.name,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        isRead: notification.is_read,
        updatedAt: notification.updated_at.getTime(),
        createdAt: notification.created_at.getTime()
    };
};

export const getUserNotificationByName = async (id: string, name: string): Promise<UserNotification | undefined> => {
    const notification = await prisma.users_notifications.findUnique({
        where: {
            user_id_name: {
                user_id: BigInt(id),
                name
            }
        }
    });

    if (!notification)
        return undefined;

    return {
        id: notification.id,
        name: notification.name,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        isRead: notification.is_read,
        updatedAt: notification.updated_at.getTime(),
        createdAt: notification.created_at.getTime()
    };
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
            id
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
                name
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

export const getGuildConfiguration = async (id: string): Promise<GuildConfiguration | undefined> => {
    const guildId = BigInt(id);
    const guildData = await prisma.guilds.findUnique({
        where: {
            id: guildId
        }
    });
    const guildConfigurationData = await prisma.guilds_configurations.findUnique({
        where: {
            id: guildId
        }
    });

    if (!guildData || !guildConfigurationData)
        return undefined;

    return {
        id,
        prefix: guildData.prefix,
        nickname: guildConfigurationData.nickname,
        language: guildConfigurationData.language as GuildConfigurationLanguage,
        timezone: guildConfigurationData.timezone as TimeZone,
        commands: JSON.parse(guildConfigurationData.commands),
        welcome: JSON.parse(guildConfigurationData.welcome),
        goodbye: JSON.parse(guildConfigurationData.goodbye),
        activity: JSON.parse(guildConfigurationData.activity),
        global_chat: JSON.parse(guildConfigurationData.global_chat),
        global_ban: JSON.parse(guildConfigurationData.global_ban),
        level: JSON.parse(guildConfigurationData.level),
        translate: JSON.parse(guildConfigurationData.translate),
        vote: JSON.parse(guildConfigurationData.vote),
        quote: JSON.parse(guildConfigurationData.quote),
        music: JSON.parse(guildConfigurationData.music),
        logging: JSON.parse(guildConfigurationData.logging)
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
