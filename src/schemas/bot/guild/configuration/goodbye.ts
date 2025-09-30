import { ConfigurationRootSchema, ConfigurationSnowflakeSchema } from '@/schemas/bot';
import { MessageDataSchema } from '@/schemas/message';

export const GuildConfigurationGoodbyeSchema = ConfigurationRootSchema.extend({
    channel_id: ConfigurationSnowflakeSchema,
    message: MessageDataSchema
});
