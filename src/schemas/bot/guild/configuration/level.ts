import { ConfigurationAccessControlSchema, ConfigurationRootSchema, ConfigurationSnowflakeSchema } from '@schemas/bot';
import { LevelAndExperienceSchema } from '@schemas/bot/guild/level';
import { DataMessageSchema } from '@schemas/message';
import { SnowflakeSchema } from '@schemas/snowflake';
import { z } from 'zod';

export const GuildConfigurationLevelAndExperienceSchema = LevelAndExperienceSchema.gte(1);

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
    level: GuildConfigurationLevelAndExperienceSchema
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
    experience_per_message: GuildConfigurationLevelAndExperienceSchema,
    disabled: ConfigurationAccessControlSchema,
    reward: GuildConfigurationLevelRewardSchema,
    notification: GuildConfigurationLevelNotificationSchema,
    leaderboard: GuildConfigurationLevelLeaderboardSchema
});
