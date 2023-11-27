import { Notification } from '@interfaces/bot';

export interface UserNotification extends Notification {
    read: boolean;
}
