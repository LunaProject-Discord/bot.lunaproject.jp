import { DataMessage } from '@interfaces/message';
import { TimeZone } from '@utils/timezone';

export interface GuildConfiguration {
    id: string;

    prefix: string;
    nickname: string;
    language: GuildConfigurationLanguage;
    timezone: TimeZone;

    commands: GuildConfigurationCommands;

    welcome: GuildConfigurationWelcome;
    goodbye: GuildConfigurationGoodbye;
    activity: GuildConfigurationActivity;

    global_chat: GuildConfigurationComponent;
    global_ban: GuildConfigurationGlobalBan;
    level: GuildConfigurationLevel;
    translate: GuildConfigurationTranslate;
    vote: GuildConfigurationComponent;
    quote: GuildConfigurationQuote;
    music: GuildConfigurationMusic;
    logging: GuildConfigurationLogging;
}

export type GuildConfigurationLanguage = 'ja-JP' | 'en-US';

export interface GuildConfigurationComponent {
    enabled: boolean;
}

export interface GuildConfigurationAccessControlComponent {
    channels: string[];
    roles: string[];
}

export interface GuildConfigurationCommands {
    permissions: GuildConfigurationCommandsPermissions;
    commands: GuildConfigurationCommand[];
}

export interface GuildConfigurationCommandsPermissions {
    channels: GuildConfigurationCommandsPermission;
    roles: GuildConfigurationCommandsPermission;
    members: { [key in string]: boolean };
}

export interface GuildConfigurationCommandsPermission {
    default: boolean | null;
    overrides: GuildConfigurationCommandsPermissionOverrides;
}

export type GuildConfigurationCommandsPermissionOverrides = { [key in string]: boolean };

export interface GuildConfigurationCommand {
    name: string;
    enabled: boolean;
    permissions: GuildConfigurationCommandsPermissions;
}

export interface GuildConfigurationWelcome extends GuildConfigurationComponent {
    channel_id: string;
    message: DataMessage;
    roles: GuildConfigurationWelcomeRole[];
}

export interface GuildConfigurationWelcomeRole {
    id: string;
}

export interface GuildConfigurationGoodbye extends GuildConfigurationComponent {
    channel_id: string;
    message: DataMessage;
}

export interface GuildConfigurationActivity extends GuildConfigurationComponent {
    roles: GuildConfigurationActivityRole[];
}

export interface GuildConfigurationActivityRole {
    id: string;
    name: string;
    type: GuildConfigurationActivityRoleType;
}

export type GuildConfigurationActivityRoleType =
    'PLAYING'
    | 'STREAMING'
    | 'LISTENING'
    | 'WATCHING'
    | 'CUSTOM_STATUS'
    | 'COMPETING';

export interface GuildConfigurationGlobalBan extends GuildConfigurationComponent {
    minimum_evaluate_value: number;
}

export interface GuildConfigurationLevel extends GuildConfigurationComponent {
    experience_per_message: number;
    disabled: GuildConfigurationAccessControlComponent;
    reward: GuildConfigurationLevelReward;
    notification: GuildConfigurationLevelNotification;
    leaderboard: GuildConfigurationLevelLeaderboard;
}

export interface GuildConfigurationLevelReward {
    type: GuildConfigurationLevelRewardType;
    remove_role_demoted: boolean;
    roles: GuildConfigurationLevelRewardRole[];
}

export type GuildConfigurationLevelRewardType = 'STACK_PREVIOUS_ROLES' | 'REMOVE_PREVIOUS_ROLES';

export interface GuildConfigurationLevelRewardRole {
    id: string;
    level: number;
}

export interface GuildConfigurationLevelNotification {
    type: GuildConfigurationLevelNotificationType;
    channel_id: string;
    message: DataMessage;
}

export type GuildConfigurationLevelNotificationType =
    'DISABLED'
    | 'DIRECT_MESSAGE'
    | 'CURRENT_CHANNEL'
    | 'CUSTOM_CHANNEL';

export interface GuildConfigurationLevelLeaderboard {
    public: boolean;
    allow_join: boolean;
    vanity_code: string | null;
}

export interface GuildConfigurationTranslate extends GuildConfigurationComponent {
    reaction: boolean;
    disabled: GuildConfigurationAccessControlComponent;
}

export interface GuildConfigurationQuote extends GuildConfigurationComponent {
    reaction: boolean;
    message: boolean;
    other_guild_to_this_guild: boolean;
    this_guild_to_other_guild: boolean;
    disabled: GuildConfigurationAccessControlComponent;
}

export interface GuildConfigurationMusic extends GuildConfigurationComponent {
    web_panel: boolean;
    default_volume: number;
    timeout_seconds: number;
    next_media_notification: boolean;
    sources: GuildConfigurationMusicSources;
}

export interface GuildConfigurationMusicSources {
    youtube: boolean;
    niconico: boolean;
    soundcloud: boolean;
    twitch: boolean;
    bandcamp: boolean;
    vimeo: boolean;
}

export interface GuildConfigurationLogging {
    enabled: boolean;

    moderation: GuildConfigurationLoggingModeration;
    member: GuildConfigurationLoggingMember;
    voice: GuildConfigurationLoggingVoice;
    category: GuildConfigurationLoggingChannel;
    text_channel: GuildConfigurationLoggingChannel;
    voice_channel: GuildConfigurationLoggingChannel;
    role: GuildConfigurationLoggingObject;
    emote: GuildConfigurationLoggingObject;
    invite: GuildConfigurationLoggingObject;
    webhook: GuildConfigurationLoggingObject;
    integration: GuildConfigurationLoggingObject;
    message: GuildConfigurationLoggingMessage;
}

export interface GuildConfigurationLoggingComponent extends GuildConfigurationComponent {
    channel_id: string;
    color: string;
}

export interface GuildConfigurationLoggingModeration extends GuildConfigurationLoggingComponent {
    update: boolean;
    kick: boolean;
    prune: boolean;
    ban: boolean;
    unban: boolean;
}

export interface GuildConfigurationLoggingMember extends GuildConfigurationLoggingComponent {
    join: boolean;
    leave: boolean;
    update: boolean;
    role_add: boolean;
    role_remove: boolean;
}

export interface GuildConfigurationLoggingVoice extends GuildConfigurationLoggingComponent {
    join: boolean;
    leave: boolean;
    move: boolean;
    mute: boolean;
    deafen: boolean;
}

export interface GuildConfigurationLoggingChannel extends GuildConfigurationLoggingComponent {
    create: boolean;
    delete: boolean;
    update: boolean;
    permissions_update: boolean;
}

export interface GuildConfigurationLoggingObject extends GuildConfigurationLoggingComponent {
    create: boolean;
    delete: boolean;
    update: boolean;
}

export interface GuildConfigurationLoggingMessage extends GuildConfigurationLoggingComponent {
    update: boolean;
    delete: boolean;
    purge: boolean;
    pin: boolean;
    unpin: boolean;
}
