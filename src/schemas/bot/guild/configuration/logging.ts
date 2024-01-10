import { ConfigurationRootSchema, ConfigurationSnowflakeSchema } from '@schemas/bot';
import { z } from 'zod';

export const GuildConfigurationLoggingRootSchema = ConfigurationRootSchema.extend({
    channel_id: ConfigurationSnowflakeSchema,
    color: z.string()
});

export const GuildConfigurationLoggingMessageSchema = GuildConfigurationLoggingRootSchema.extend({
    update: z.boolean(),
    delete: z.boolean(),
    purge: z.boolean(),
    pin: z.boolean(),
    unpin: z.boolean()
});

export const GuildConfigurationLoggingObjectSchema = GuildConfigurationLoggingRootSchema.extend({
    create: z.boolean(),
    delete: z.boolean(),
    update: z.boolean()
});

export const GuildConfigurationLoggingChannelSchema = GuildConfigurationLoggingObjectSchema.extend({
    permissions_update: z.boolean()
});

export const GuildConfigurationLoggingVoiceSchema = GuildConfigurationLoggingRootSchema.extend({
    join: z.boolean(),
    leave: z.boolean(),
    move: z.boolean(),
    mute: z.boolean(),
    deafen: z.boolean()
});

export const GuildConfigurationLoggingMemberSchema = GuildConfigurationLoggingRootSchema.extend({
    join: z.boolean(),
    leave: z.boolean(),
    update: z.boolean(),
    role_add: z.boolean(),
    role_remove: z.boolean()
});

export const GuildConfigurationLoggingModerationSchema = GuildConfigurationLoggingRootSchema.extend({
    update: z.boolean(),
    kick: z.boolean(),
    prune: z.boolean(),
    ban: z.boolean(),
    unban: z.boolean()
});

export const GuildConfigurationLoggingSchema = ConfigurationRootSchema.extend({
    moderation: GuildConfigurationLoggingModerationSchema,
    member: GuildConfigurationLoggingMemberSchema,
    voice: GuildConfigurationLoggingVoiceSchema,
    category: GuildConfigurationLoggingChannelSchema,
    text_channel: GuildConfigurationLoggingChannelSchema,
    voice_channel: GuildConfigurationLoggingChannelSchema,
    role: GuildConfigurationLoggingObjectSchema,
    emote: GuildConfigurationLoggingObjectSchema,
    invite: GuildConfigurationLoggingObjectSchema,
    webhook: GuildConfigurationLoggingObjectSchema,
    integration: GuildConfigurationLoggingObjectSchema,
    message: GuildConfigurationLoggingMessageSchema
});
