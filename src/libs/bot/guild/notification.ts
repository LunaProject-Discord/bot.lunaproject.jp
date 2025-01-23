import { database, Guild_Notification_Reads, Guild_Notifications } from '@/database';
import { GuildNotification } from '@/interfaces/bot';
import { fromSQLDate, toSQLDate } from '@/utils/date';
import { and, eq, inArray } from 'drizzle-orm';

export const getGuildNotifications = async (id: string): Promise<GuildNotification[]> => {
    const guildId = BigInt(id);

    const guildNotifications = await database.query.Guild_Notifications.findMany({
        where: eq(Guild_Notifications.guildId, guildId),
        with: {
            systemNotification: true
        }
    });
    const guildNotificationsReads = await database.query.Guild_Notification_Reads.findMany({
        where: and(
            eq(Guild_Notification_Reads.guildId, guildId),
            inArray(Guild_Notification_Reads.notificationId, guildNotifications.map((notification) => notification.notificationId))
        )
    });

    const notifications: GuildNotification[] = [];
    for (const guildNotification of guildNotifications) {
        const notification = guildNotification.systemNotification;
        const guildNotificationReads = guildNotificationsReads.filter((read) => read.notificationId === notification.id);

        notifications.push({
            id: notification.id,
            type: notification.type,
            title: notification.title,
            description: notification.description,
            reads: guildNotificationReads.map((read) => read.userId.toString()),
            updatedAt: fromSQLDate(notification.updatedAt).toMillis(),
            createdAt: fromSQLDate(notification.createdAt).toMillis()
        });
    }

    return notifications;
};

export const getGuildNotification = async (id: string, notificationId: string): Promise<GuildNotification | undefined> => {
    const guildId = BigInt(id);

    const guildNotification = await database.query.Guild_Notifications.findFirst({
        where: and(
            eq(Guild_Notifications.guildId, guildId),
            eq(Guild_Notifications.notificationId, notificationId)
        ),
        with: {
            systemNotification: true
        }
    });
    if (!guildNotification)
        return undefined;

    const guildNotificationReads = await database.query.Guild_Notification_Reads.findMany({
        where: and(
            eq(Guild_Notification_Reads.guildId, guildId),
            eq(Guild_Notification_Reads.notificationId, notificationId)
        )
    });

    const notification = guildNotification.systemNotification;
    return {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        reads: guildNotificationReads.map((read) => read.userId.toString()),
        updatedAt: fromSQLDate(notification.updatedAt).toMillis(),
        createdAt: fromSQLDate(notification.createdAt).toMillis()
    };
};

export const setGuildNotificationRead = async (id: string, notificationId: string, userId: string, read: boolean) => {
    const guildId = BigInt(id);

    const guildNotification = await database.query.Guild_Notifications.findFirst({
        where: and(
            eq(Guild_Notifications.guildId, guildId),
            eq(Guild_Notifications.notificationId, notificationId)
        )
    });
    if (!guildNotification)
        return;

    if (read) {
        await database
            .insert(Guild_Notification_Reads)
            .values({
                guildId,
                notificationId,
                userId: BigInt(userId)
            })
            .onDuplicateKeyUpdate({
                set: {
                    updatedAt: toSQLDate()
                }
            });
    } else {
        await database
            .delete(Guild_Notification_Reads)
            .where(
                and(
                    eq(Guild_Notification_Reads.guildId, guildId),
                    eq(Guild_Notification_Reads.notificationId, notificationId),
                    eq(Guild_Notification_Reads.userId, BigInt(userId))
                )
            );
    }
};
