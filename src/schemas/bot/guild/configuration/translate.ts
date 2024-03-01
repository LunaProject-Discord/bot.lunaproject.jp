import { ConfigurationAccessControlSchema, ConfigurationRootSchema } from '@/schemas/bot';
import { z } from 'zod';

export const GuildConfigurationTranslateSchema = ConfigurationRootSchema.extend({
    reaction: z.boolean(),
    disabled: ConfigurationAccessControlSchema
});
