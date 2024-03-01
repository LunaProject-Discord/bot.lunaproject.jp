import { ConfigurationRootSchema } from '@/schemas/bot';
import { z } from 'zod';

export const GuildConfigurationMusicSourcesSchema = z.object({
    youtube: z.boolean(),
    niconico: z.boolean(),
    soundcloud: z.boolean(),
    twitch: z.boolean(),
    bandcamp: z.boolean(),
    vimeo: z.boolean()
});

export const GuildConfigurationMusicSchema = ConfigurationRootSchema.extend({
    web_panel: z.boolean(),
    default_volume: z.number().gte(0).lte(100).step(1).int(),
    timeout_seconds: z.number().gte(0).step(1).int(),
    next_media_notification: z.boolean(),
    sources: GuildConfigurationMusicSourcesSchema
});
