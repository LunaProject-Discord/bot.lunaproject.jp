import { GuildNotification } from '@interfaces/bot';
import prisma from '@libs/prisma';
import { fromBinaryUUID, toBinaryUUID } from '@utils/uuid';

export const getGuildNotifications = async (id: string): Promise<GuildNotification[]> => {
    const guildId = BigInt(id);
    const guildNotifications = await prisma.guilds_notifications.findMany({
        where: {
            id: guildId
        },
        include: {
            system_notifications: true,
            guilds_notifications_reads: true
        }
    });

    const notifications: GuildNotification[] = [];
    for (const guildNotification of guildNotifications) {
        const notification = guildNotification.system_notifications;
        notifications.push({
            id: fromBinaryUUID(notification.id),
            type: notification.type,
            title: notification.title,
            description: notification.description,
            reads: guildNotification.guilds_notifications_reads.map((read) => read.user_id.toString()),
            updatedAt: notification.updated_at.getTime(),
            createdAt: notification.created_at.getTime()
        });
    }

    return notifications;
};

export const getGuildNotificationById = async (id: string, notificationId: string): Promise<GuildNotification | undefined> => {
    const guildNotification = await prisma.guilds_notifications.findUnique({
        where: {
            id_notification_id: {
                id: BigInt(id),
                notification_id: toBinaryUUID(notificationId)
            }
        },
        include: {
            system_notifications: true,
            guilds_notifications_reads: true
        }
    });

    if (!guildNotification)
        return undefined;

    const notification = guildNotification.system_notifications;
    return {
        id: fromBinaryUUID(notification.id),
        type: notification.type,
        title: notification.title,
        description: notification.description,
        reads: guildNotification.guilds_notifications_reads.map((read) => read.user_id.toString()),
        updatedAt: notification.updated_at.getTime(),
        createdAt: notification.created_at.getTime()
    };
};

export const setGuildNotificationRead = async (id: string, notificationId: string, userId: string, read: boolean) => {
    const guildId = BigInt(id);
    const binaryNotificationId = toBinaryUUID(notificationId);

    const guildNotification = await prisma.guilds_notifications.findUnique({
        where: {
            id_notification_id: {
                id: guildId,
                notification_id: binaryNotificationId
            }
        }
    });

    if (!guildNotification)
        return;

    if (read) {
        await prisma.guilds_notifications_reads.upsert({
            where: {
                id_guild_id_user_id: {
                    id: binaryNotificationId,
                    guild_id: guildId,
                    user_id: BigInt(userId)
                }
            },
            update: {
                updated_at: new Date()
            },
            create: {
                id: binaryNotificationId,
                guild_id: guildId,
                user_id: BigInt(userId),
                updated_at: new Date(),
                created_at: new Date()
            }
        });
    } else {
        await prisma.guilds_notifications_reads.delete({
            where: {
                id_guild_id_user_id: {
                    id: binaryNotificationId,
                    guild_id: guildId,
                    user_id: BigInt(userId)
                }
            }
        });
    }
};
