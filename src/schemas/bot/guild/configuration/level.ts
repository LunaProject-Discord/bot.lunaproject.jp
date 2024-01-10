import { ConfigurationAccessControlSchema, ConfigurationRootSchema, ConfigurationSnowflakeSchema } from '@schemas/bot';
import { DataMessageSchema } from '@schemas/message';
import { SnowflakeSchema } from '@schemas/snowflake';
import { z } from 'zod';

export const GuildConfigurationLevelLeaderboardSchema = z.object({
    public: z.boolean(),
    allow_join: z.boolean(),
    vanity_code: z.string().nullable()
});

export const GuildConfigurationLevelNotificationTypeSchema = z.union([
    z.literal('DISABLED'),
    z.literal('DIRECT_MESSAGE'),
    z.literal('CURRENT_CHANNEL'),
    z.literal('CUSTOM_CHANNEL')
]);

export const GuildConfigurationLevelNotificationSchema = z.object({
    type: GuildConfigurationLevelNotificationTypeSchema,
    channel_id: ConfigurationSnowflakeSchema,
    message: DataMessageSchema
});

export const GuildConfigurationLevelRewardRoleSchema = ConfigurationRootSchema.extend({
    id: SnowflakeSchema,
    level: z.number().gte(1).step(1).int()
});

export const GuildConfigurationLevelRewardTypeSchema = z.union([
    z.literal('STACK_PREVIOUS_ROLES'),
    z.literal('REMOVE_PREVIOUS_ROLES')
]);

export const GuildConfigurationLevelRewardSchema = z.object({
    type: GuildConfigurationLevelRewardTypeSchema,
    remove_role_demoted: z.boolean(),
    roles: z.array(GuildConfigurationLevelRewardRoleSchema)
});

export const GuildConfigurationLevelSchema = ConfigurationRootSchema.extend({
    experience_per_message: z.number().gte(1).step(1).int(),
    disabled: ConfigurationAccessControlSchema,
    reward: GuildConfigurationLevelRewardSchema,
    notification: GuildConfigurationLevelNotificationSchema,
    leaderboard: GuildConfigurationLevelLeaderboardSchema
});
