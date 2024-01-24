import { RedisMember, RedisSnowflake, RedisUser } from '@interfaces/redis';
import { PartialGuildLevelRecordSchema, PartialGuildLevelSchema, PartialGuildLevelsSchema } from '@schemas/bot';
import { z } from 'zod';

export type PartialGuildLevel = z.infer<typeof PartialGuildLevelSchema>;

export type PartialGuildLevels = z.infer<typeof PartialGuildLevelsSchema>;

export type PartialGuildLevelRecord = z.infer<typeof PartialGuildLevelRecordSchema>;

export interface GuildLevel extends Omit<PartialGuildLevel, 'user_id'> {
    user: RedisUser | RedisSnowflake;
    member?: RedisMember;
    rank: number;
}
