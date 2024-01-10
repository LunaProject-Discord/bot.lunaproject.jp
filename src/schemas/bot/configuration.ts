import { SnowflakeSchema } from '@schemas/snowflake';
import { z } from 'zod';

export const ConfigurationSnowflakeSchema = z.union([z.literal(''), SnowflakeSchema]);

export const ConfigurationLanguageSchema = z.union([z.literal('ja-JP'), z.literal('en-US')]);

export const ConfigurationRootSchema = z.object({
    enabled: z.boolean()
});

export const ConfigurationAccessControlSchema = z.object({
    channels: z.array(SnowflakeSchema),
    roles: z.array(SnowflakeSchema)
});
