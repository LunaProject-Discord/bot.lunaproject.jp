import { database, User_Notifications } from '@/database';
import { UserNotification } from '@/interfaces/bot';
import { fromSQLDate } from '@/utils/date';
import { and, eq } from 'drizzle-orm';

export const getUserNotifications = async (id: string): Promise<UserNotification[]> => {
    const userNotifications = await database.query.User_Notifications.findMany({
        where: eq(User_Notifications.userId, BigInt(id)),
        with: {
            systemNotification: true
        }
    });

    const notifications: UserNotification[] = [];
    for (const userNotification of userNotifications) {
        const notification = userNotification.systemNotification;
        notifications.push({
            id: notification.id,
            type: notification.type,
            title: notification.title,
            description: notification.description,
            read: Boolean(userNotification.isRead),
            updatedAt: fromSQLDate(notification.updatedAt).toMillis(),
            createdAt: fromSQLDate(notification.createdAt).toMillis()
        });
    }

    return notifications;
};

export const getUserNotification = async (id: string, notificationId: string): Promise<UserNotification | undefined> => {
    const userNotification = await database.query.User_Notifications.findFirst({
        where: and(
            eq(User_Notifications.userId, BigInt(id)),
            eq(User_Notifications.notificationId, notificationId)
        ),
        with: {
            systemNotification: true
        }
    });
    if (!userNotification)
        return undefined;

    const notification = userNotification.systemNotification;
    return {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        read: Boolean(userNotification.isRead),
        updatedAt: fromSQLDate(notification.updatedAt).toMillis(),
        createdAt: fromSQLDate(notification.createdAt).toMillis()
    };
};

export const setUserNotificationRead = async (id: string, notificationId: string, read: boolean) => {
    const userNotification = await database.query.User_Notifications.findFirst({
        where: and(
            eq(User_Notifications.userId, BigInt(id)),
            eq(User_Notifications.notificationId, notificationId)
        )
    });
    if (!userNotification)
        return;

    await database
        .update(User_Notifications)
        .set({
            isRead: read
        })
        .where(
            and(
                eq(User_Notifications.userId, BigInt(id)),
                eq(User_Notifications.notificationId, notificationId)
            )
        );
};
