import { SnowflakeSchema } from '@/schemas/snowflake';
import { z } from 'zod';

export const LevelAndExperienceSchema = z.number().int('level_error_invalid_type_level_or_experience');

export const PartialGuildLevelSchema = z.object({
    user_id: SnowflakeSchema,
    level: LevelAndExperienceSchema,
    experience: LevelAndExperienceSchema
});

export const PartialGuildLevelsSchema = z.array(PartialGuildLevelSchema);

export const PartialGuildLevelRecordSchema = z.record(SnowflakeSchema, PartialGuildLevelSchema);
