import { GuildNotification } from '@interfaces/bot';
import prisma from '@libs/prisma';

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
