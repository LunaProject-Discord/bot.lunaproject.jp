import {
    GuildConfigurationActivityRoleSchema,
    GuildConfigurationActivityRoleTypeSchema,
    GuildConfigurationActivitySchema,
    GuildConfigurationCommandSchema,
    GuildConfigurationCommandsPermissionOverridesSchema,
    GuildConfigurationCommandsPermissionSchema,
    GuildConfigurationCommandsPermissionsSchema,
    GuildConfigurationCommandsSchema,
    GuildConfigurationGlobalBanSchema,
    GuildConfigurationGoodbyeSchema,
    GuildConfigurationLevelLeaderboardSchema,
    GuildConfigurationLevelNotificationSchema,
    GuildConfigurationLevelNotificationTypeSchema,
    GuildConfigurationLevelRewardRoleSchema,
    GuildConfigurationLevelRewardSchema,
    GuildConfigurationLevelRewardTypeSchema,
    GuildConfigurationLevelSchema,
    GuildConfigurationLoggingChannelSchema,
    GuildConfigurationLoggingMemberSchema,
    GuildConfigurationLoggingMessageSchema,
    GuildConfigurationLoggingModerationSchema,
    GuildConfigurationLoggingObjectSchema,
    GuildConfigurationLoggingRootSchema,
    GuildConfigurationLoggingSchema,
    GuildConfigurationLoggingVoiceSchema,
    GuildConfigurationMemberJoinAfterPendingRoleSchema,
    GuildConfigurationMemberJoinAfterPendingRolesSchema,
    GuildConfigurationMemberJoinAfterPendingSchema,
    GuildConfigurationMemberJoinBeforePendingRoleSchema,
    GuildConfigurationMemberJoinBeforePendingRolesSchema,
    GuildConfigurationMemberJoinBeforePendingRoleTargetTypeSchema,
    GuildConfigurationMemberJoinBeforePendingSchema,
    GuildConfigurationMemberJoinMessageSchema,
    GuildConfigurationMemberJoinSchema,
    GuildConfigurationMusicSchema,
    GuildConfigurationMusicSourcesSchema,
    GuildConfigurationNicknameSchema,
    GuildConfigurationPrefixAndNicknameSchema,
    GuildConfigurationPrefixSchema,
    GuildConfigurationQuoteSchema,
    GuildConfigurationSchema,
    GuildConfigurationTranslateSchema,
    GuildConfigurationVoteSchema,
    PartialGuildConfigurationSchema
} from '@/schemas/bot';
import { z } from 'zod';

export type GuildConfiguration = z.infer<typeof GuildConfigurationSchema>;

export type GuildConfigurationPrefixAndNickname = z.infer<typeof GuildConfigurationPrefixAndNicknameSchema>;

export type GuildConfigurationPrefix = z.infer<typeof GuildConfigurationPrefixSchema>;

export type GuildConfigurationNickname = z.infer<typeof GuildConfigurationNicknameSchema>;

export type GuildConfigurationCommands = z.infer<typeof GuildConfigurationCommandsSchema>;

export type GuildConfigurationCommandsPermissions = z.infer<typeof GuildConfigurationCommandsPermissionsSchema>;

export type GuildConfigurationCommandsPermission = z.infer<typeof GuildConfigurationCommandsPermissionSchema>;

export type GuildConfigurationCommandsPermissionOverrides = z.infer<typeof GuildConfigurationCommandsPermissionOverridesSchema>;

export type GuildConfigurationCommand = z.infer<typeof GuildConfigurationCommandSchema>;

export type GuildConfigurationMemberJoin = z.infer<typeof GuildConfigurationMemberJoinSchema>;

export type GuildConfigurationMemberJoinBeforePending = z.infer<typeof GuildConfigurationMemberJoinBeforePendingSchema>;

export type GuildConfigurationMemberJoinBeforePendingRoles = z.infer<typeof GuildConfigurationMemberJoinBeforePendingRolesSchema>;

export type GuildConfigurationMemberJoinBeforePendingRole = z.infer<typeof GuildConfigurationMemberJoinBeforePendingRoleSchema>;

export type GuildConfigurationMemberJoinBeforePendingRoleTargetType = z.infer<typeof GuildConfigurationMemberJoinBeforePendingRoleTargetTypeSchema>;

export type GuildConfigurationMemberJoinAfterPending = z.infer<typeof GuildConfigurationMemberJoinAfterPendingSchema>;

export type GuildConfigurationMemberJoinAfterPendingRoles = z.infer<typeof GuildConfigurationMemberJoinAfterPendingRolesSchema>;

export type GuildConfigurationMemberJoinAfterPendingRole = z.infer<typeof GuildConfigurationMemberJoinAfterPendingRoleSchema>;

export type GuildConfigurationMemberJoinMessage = z.infer<typeof GuildConfigurationMemberJoinMessageSchema>;

export type GuildConfigurationGoodbye = z.infer<typeof GuildConfigurationGoodbyeSchema>;

export type GuildConfigurationActivity = z.infer<typeof GuildConfigurationActivitySchema>;

export type GuildConfigurationActivityRole = z.infer<typeof GuildConfigurationActivityRoleSchema>;

export type GuildConfigurationActivityRoleType = z.infer<typeof GuildConfigurationActivityRoleTypeSchema>;

export type GuildConfigurationGlobalBan = z.infer<typeof GuildConfigurationGlobalBanSchema>;

export type GuildConfigurationLevel = z.infer<typeof GuildConfigurationLevelSchema>;

export type GuildConfigurationLevelReward = z.infer<typeof GuildConfigurationLevelRewardSchema>;

export type GuildConfigurationLevelRewardType = z.infer<typeof GuildConfigurationLevelRewardTypeSchema>;

export type GuildConfigurationLevelRewardRole = z.infer<typeof GuildConfigurationLevelRewardRoleSchema>;

export type GuildConfigurationLevelNotification = z.infer<typeof GuildConfigurationLevelNotificationSchema>;

export type GuildConfigurationLevelNotificationType = z.infer<typeof GuildConfigurationLevelNotificationTypeSchema>;

export type GuildConfigurationLevelLeaderboard = z.infer<typeof GuildConfigurationLevelLeaderboardSchema>;

export type GuildConfigurationTranslate = z.infer<typeof GuildConfigurationTranslateSchema>;

export type GuildConfigurationVote = z.infer<typeof GuildConfigurationVoteSchema>;

export type GuildConfigurationQuote = z.infer<typeof GuildConfigurationQuoteSchema>;

export type GuildConfigurationMusic = z.infer<typeof GuildConfigurationMusicSchema>;

export type GuildConfigurationMusicSources = z.infer<typeof GuildConfigurationMusicSourcesSchema>;

export type GuildConfigurationLogging = z.infer<typeof GuildConfigurationLoggingSchema>;

export type GuildConfigurationLoggingRoot = z.infer<typeof GuildConfigurationLoggingRootSchema>;

export type GuildConfigurationLoggingModeration = z.infer<typeof GuildConfigurationLoggingModerationSchema>;

export type GuildConfigurationLoggingMember = z.infer<typeof GuildConfigurationLoggingMemberSchema>;

export type GuildConfigurationLoggingVoice = z.infer<typeof GuildConfigurationLoggingVoiceSchema>;

export type GuildConfigurationLoggingChannel = z.infer<typeof GuildConfigurationLoggingChannelSchema>;

export type GuildConfigurationLoggingObject = z.infer<typeof GuildConfigurationLoggingObjectSchema>;

export type GuildConfigurationLoggingMessage = z.infer<typeof GuildConfigurationLoggingMessageSchema>;

export type PartialGuildConfiguration = z.infer<typeof PartialGuildConfigurationSchema>;
