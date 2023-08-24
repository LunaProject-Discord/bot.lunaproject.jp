import { PermissionFlagsBits } from 'discord-api-types/v10';

export const ADVANCED_PERMISSIONS = [
    PermissionFlagsBits.Administrator
];

export const GENERAL_PERMISSIONS = [
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageWebhooks,
    PermissionFlagsBits.ManageGuildExpressions,
    PermissionFlagsBits.ViewAuditLog,
    PermissionFlagsBits.ViewGuildInsights,
    PermissionFlagsBits.ViewCreatorMonetizationAnalytics,
    PermissionFlagsBits.ViewChannel
];

export const MEMBERSHIP_PERMISSIONS = [
    PermissionFlagsBits.CreateInstantInvite,
    PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers
];

export const TEXT_PERMISSIONS = [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.SendTTSMessages,
    PermissionFlagsBits.SendVoiceMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.UseExternalStickers,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.MentionEveryone,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.UseApplicationCommands
];

export const THREAD_PERMISSIONS = [
    PermissionFlagsBits.SendMessagesInThreads,
    PermissionFlagsBits.CreatePublicThreads,
    PermissionFlagsBits.CreatePrivateThreads,
    PermissionFlagsBits.ManageThreads
];

export const VOICE_PERMISSIONS = [
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
    PermissionFlagsBits.Stream,
    PermissionFlagsBits.UseEmbeddedActivities,
    PermissionFlagsBits.UseSoundboard,
    PermissionFlagsBits.UseExternalSounds,
    PermissionFlagsBits.UseVAD,
    PermissionFlagsBits.PrioritySpeaker,
    PermissionFlagsBits.MuteMembers,
    PermissionFlagsBits.DeafenMembers,
    PermissionFlagsBits.MoveMembers
];

export const STAGE_PERMISSIONS = [
    PermissionFlagsBits.RequestToSpeak
];

export const EVENTS_PERMISSIONS = [
    PermissionFlagsBits.ManageEvents
];

export const ALL_PERMISSIONS = [
    ...ADVANCED_PERMISSIONS,
    ...GENERAL_PERMISSIONS,
    ...MEMBERSHIP_PERMISSIONS,
    ...TEXT_PERMISSIONS,
    ...THREAD_PERMISSIONS,
    ...VOICE_PERMISSIONS,
    ...STAGE_PERMISSIONS,
    ...EVENTS_PERMISSIONS
];
