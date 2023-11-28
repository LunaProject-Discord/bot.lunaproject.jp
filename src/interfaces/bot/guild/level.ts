import { RedisSnowflake, RedisUser } from '@interfaces/redis';

export interface PartialGuildLevel {
    user_id: string;
    level: number;
    xp: number;
}

export interface GuildLevel extends Omit<PartialGuildLevel, 'user_id'> {
    user: RedisUser | RedisSnowflake;
    rank: number;
}
