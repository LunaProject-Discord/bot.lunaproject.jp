import { ConfigurationRootSchema, ConfigurationSnowflakeSchema } from '@schemas/bot';
import { DataMessageSchema } from '@schemas/message';

export const GuildConfigurationGoodbyeSchema = ConfigurationRootSchema.extend({
    channel_id: ConfigurationSnowflakeSchema,
    message: DataMessageSchema
});
