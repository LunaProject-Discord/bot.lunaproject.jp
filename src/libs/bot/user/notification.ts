import { UserNotification } from '@interfaces/bot';
import prisma from '@libs/prisma';

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
            read: notification.is_read,
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
        read: notification.is_read,
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
        read: notification.is_read,
        updatedAt: notification.updated_at.getTime(),
        createdAt: notification.created_at.getTime()
    };
};
