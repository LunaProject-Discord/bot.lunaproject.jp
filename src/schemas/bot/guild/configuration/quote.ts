import { ConfigurationAccessControlSchema, ConfigurationRootSchema } from '@/schemas/bot';
import { z } from 'zod';

export const GuildConfigurationQuoteSchema = ConfigurationRootSchema.extend({
    reaction: z.boolean(),
    message: z.boolean(),
    other_guild_to_this_guild: z.boolean(),
    this_guild_to_other_guild: z.boolean(),
    disabled: ConfigurationAccessControlSchema
});
