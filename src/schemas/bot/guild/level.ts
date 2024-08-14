import { SnowflakeSchema } from '@/schemas/snowflake';
import { MAX_LEVEL_AND_EXPERIENCE } from '@/utils/level';
import { z } from 'zod';

export const LevelAndExperienceSchema = z.number().int('level_error_invalid_type_level_or_experience').min(0).max(MAX_LEVEL_AND_EXPERIENCE);

export const PartialGuildLevelSchema = z.object({
    user_id: SnowflakeSchema,
    level: LevelAndExperienceSchema,
    experience: LevelAndExperienceSchema
});

export const PartialGuildLevelsSchema = z.array(PartialGuildLevelSchema);

export const PartialGuildLevelRecordSchema = z.record(SnowflakeSchema, PartialGuildLevelSchema);
