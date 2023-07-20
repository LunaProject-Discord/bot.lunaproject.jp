import { UserNotification } from '@interfaces/bot/user';

export interface GuildNotification extends Omit<UserNotification, 'read'> {
    reads: string[];
}
