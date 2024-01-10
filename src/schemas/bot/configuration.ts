import { SnowflakeSchema } from '@schemas/snowflake';
import { TimeZone } from '@utils/timezone';
import { z } from 'zod';

export const ConfigurationSnowflakeSchema = z.union([z.literal(''), z.literal('0'), SnowflakeSchema]);

export const ConfigurationLanguageSchema = z.union([z.literal('ja-JP'), z.literal('en-US')]);

export const ConfigurationTimeZoneSchema = z.literal<TimeZone>('Asia/Tokyo');

export const ConfigurationTimeAndLanguageSchema = z.object({
    language: ConfigurationLanguageSchema,
    timezone: ConfigurationTimeZoneSchema
});

export const ConfigurationRootSchema = z.object({
    enabled: z.boolean()
});

export const ConfigurationAccessControlSchema = z.object({
    channels: z.array(SnowflakeSchema),
    roles: z.array(SnowflakeSchema)
});
