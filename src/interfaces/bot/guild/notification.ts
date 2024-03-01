import { Notification } from '@/interfaces/bot';

export interface GuildNotification extends Notification {
    reads: string[];
}
