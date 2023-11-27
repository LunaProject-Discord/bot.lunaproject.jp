import { UserNotification } from '@interfaces/bot';
import prisma from '@libs/prisma';
import { fromBinaryUUID, toBinaryUUID } from '@utils/uuid';

export const getUserNotifications = async (id: string): Promise<UserNotification[]> => {
    const userNotifications = await prisma.users_notifications.findMany({
        where: {
            id: BigInt(id)
        },
        include: {
            system_notifications: true
        }
    });

    const notifications: UserNotification[] = [];
    for (const userNotification of userNotifications) {
        const notification = userNotification.system_notifications;
        notifications.push({
            id: fromBinaryUUID(notification.id),
            type: notification.type,
            title: notification.title,
            description: notification.description,
            read: userNotification.is_read,
            updatedAt: notification.updated_at.getTime(),
            createdAt: notification.created_at.getTime()
        });
    }

    return notifications;
};

export const getUserNotificationById = async (id: string, notificationId: string): Promise<UserNotification | undefined> => {
    const userNotification = await prisma.users_notifications.findUnique({
        where: {
            id_notification_id: {
                id: BigInt(id),
                notification_id: toBinaryUUID(notificationId)
            }
        },
        include: {
            system_notifications: true
        }
    });

    if (!userNotification)
        return undefined;

    const notification = userNotification.system_notifications;
    return {
        id: fromBinaryUUID(notification.id),
        type: notification.type,
        title: notification.title,
        description: notification.description,
        read: userNotification.is_read,
        updatedAt: notification.updated_at.getTime(),
        createdAt: notification.created_at.getTime()
    };
};

export const setUserNotificationRead = async (id: string, notificationId: string, read: boolean) => {
    const userNotification = await prisma.users_notifications.findUnique({
        where: {
            id_notification_id: {
                id: BigInt(id),
                notification_id: toBinaryUUID(notificationId)
            }
        }
    });

    if (!userNotification)
        return;

    await prisma.users_notifications.update({
        where: {
            id_notification_id: {
                id: BigInt(id),
                notification_id: toBinaryUUID(notificationId)
            }
        },
        data: {
            is_read: read
        }
    });
};
