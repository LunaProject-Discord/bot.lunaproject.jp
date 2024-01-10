import { SnowflakeSchema } from '@schemas/snowflake';
import { z } from 'zod';

export const LevelAndExperienceSchema = z.number().int().step(1);

export const PartialGuildLevelSchema = z.object({
    user_id: SnowflakeSchema,
    level: LevelAndExperienceSchema,
    xp: LevelAndExperienceSchema
});

export const PartialGuildLevelsSchema = z.array(PartialGuildLevelSchema);

export const PartialGuildLevelRecordSchema = z.record(SnowflakeSchema, PartialGuildLevelSchema);
