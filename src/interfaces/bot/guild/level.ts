import { PartialUser } from '@interfaces/bot/user';

export interface PartialGuildLevel {
    user_id: string;
    level: number;
    xp: number;
}

export interface GuildLevel extends Omit<PartialGuildLevel, 'user_id'> {
    user: PartialUser;
    rank: number;
}
