import { ConfigurationRootSchema, ConfigurationSnowflakeSchema } from '@schemas/bot';
import { DataMessageSchema } from '@schemas/message';
import { SnowflakeSchema } from '@schemas/snowflake';
import { z } from 'zod';

export const GuildConfigurationWelcomeRoleSchema = ConfigurationRootSchema.extend({
    id: SnowflakeSchema
});

export const GuildConfigurationWelcomeSchema = ConfigurationRootSchema.extend({
    channel_id: ConfigurationSnowflakeSchema,
    message: DataMessageSchema,
    roles: z.array(GuildConfigurationWelcomeRoleSchema)
});
