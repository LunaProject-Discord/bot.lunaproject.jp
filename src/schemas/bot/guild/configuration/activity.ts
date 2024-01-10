import { ConfigurationRootSchema } from '@schemas/bot';
import { SnowflakeSchema } from '@schemas/snowflake';
import { z } from 'zod';

export const GuildConfigurationActivityRoleTypeSchema = z.union([
    z.literal('PLAYING'),
    z.literal('STREAMING'),
    z.literal('LISTENING'),
    z.literal('WATCHING'),
    z.literal('CUSTOM_STATUS'),
    z.literal('COMPETING')
]);

export const GuildConfigurationActivityRoleSchema = ConfigurationRootSchema.extend({
    id: SnowflakeSchema,
    name: z.string(),
    type: GuildConfigurationActivityRoleTypeSchema
});

export const GuildConfigurationActivitySchema = ConfigurationRootSchema.extend({
    roles: z.array(GuildConfigurationActivityRoleSchema)
});
