import { ConfigurationRootSchema, ConfigurationSnowflakeSchema } from '@/schemas/bot';
import { DataMessageSchema } from '@/schemas/message';
import { SnowflakeSchema } from '@/schemas/snowflake';
import { z } from 'zod';

export const GuildConfigurationMemberJoinMessageSchema = ConfigurationRootSchema.extend({
    channel_id: ConfigurationSnowflakeSchema,
    message: DataMessageSchema
});

export const GuildConfigurationMemberJoinAfterPendingRoleSchema = ConfigurationRootSchema.extend({
    id: SnowflakeSchema
});

export const GuildConfigurationMemberJoinAfterPendingRolesSchema = ConfigurationRootSchema.extend({
    roles: z.array(GuildConfigurationMemberJoinAfterPendingRoleSchema)
});

export const GuildConfigurationMemberJoinAfterPendingSchema = ConfigurationRootSchema.extend({
    message: GuildConfigurationMemberJoinMessageSchema,
    roles: GuildConfigurationMemberJoinAfterPendingRolesSchema
});

export const GuildConfigurationMemberJoinBeforePendingRoleTargetTypeSchema = z.union([
    z.literal('EVERYONE'),
    z.literal('USER'),
    z.literal('BOT'),
    z.literal('VERIFIED_BOT'),
    z.literal('NOT_VERIFIED_BOT')
]);

export const GuildConfigurationMemberJoinBeforePendingRoleSchema = ConfigurationRootSchema.extend({
    id: SnowflakeSchema,
    type: GuildConfigurationMemberJoinBeforePendingRoleTargetTypeSchema
});

export const GuildConfigurationMemberJoinBeforePendingRolesSchema = ConfigurationRootSchema.extend({
    roles: z.array(GuildConfigurationMemberJoinBeforePendingRoleSchema)
});

export const GuildConfigurationMemberJoinBeforePendingSchema = ConfigurationRootSchema.extend({
    message: GuildConfigurationMemberJoinMessageSchema,
    roles: GuildConfigurationMemberJoinBeforePendingRolesSchema
});

export const GuildConfigurationMemberJoinSchema = ConfigurationRootSchema.extend({
    before_pending: GuildConfigurationMemberJoinBeforePendingSchema,
    after_pending: GuildConfigurationMemberJoinAfterPendingSchema
});
