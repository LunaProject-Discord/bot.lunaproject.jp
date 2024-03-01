import { ConfigurationRootSchema } from '@/schemas/bot';
import { z } from 'zod';

export const GuildConfigurationVoteSchema = ConfigurationRootSchema.extend(({
    votes: z.array(z.object({}))
}));
