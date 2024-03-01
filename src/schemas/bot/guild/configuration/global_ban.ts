import { ConfigurationRootSchema } from '@/schemas/bot';
import { z } from 'zod';

export const GuildConfigurationGlobalBanSchema = ConfigurationRootSchema.extend({
    minimum_evaluate_value: z.number().gte(0).lte(10)
});
