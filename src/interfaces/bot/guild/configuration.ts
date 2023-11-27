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
    welcome_v2: GuildConfigurationWelcomeV2;
    goodbye: GuildConfigurationGoodbye;
    activity: GuildConfigurationActivity;

    global_chat: GuildConfigurationRoot;
    global_ban: GuildConfigurationGlobalBan;
    level: GuildConfigurationLevel;
    translate: GuildConfigurationTranslate;
    vote: GuildConfigurationRoot;
    quote: GuildConfigurationQuote;
    music: GuildConfigurationMusic;
    logging: GuildConfigurationLogging;
}

export type GuildConfigurationLanguage = 'ja-JP' | 'en-US';

export interface GuildConfigurationRoot {
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

export interface GuildConfigurationWelcome extends GuildConfigurationRoot {
    channel_id: string;
    message: DataMessage;
    roles: GuildConfigurationWelcomeRole[];
}

export interface GuildConfigurationWelcomeRole extends GuildConfigurationRoot {
    id: string;
}

export interface GuildConfigurationWelcomeV2 extends GuildConfigurationRoot {
    before_pending: GuildConfigurationWelcomeV2BeforePending;
    after_pending: GuildConfigurationWelcomeV2AfterPending;
}

export interface GuildConfigurationWelcomeV2BeforePending extends GuildConfigurationRoot {
    message: GuildConfigurationWelcomeV2Message;
    roles: GuildConfigurationWelcomeV2BeforePendingRoles;
}

export interface GuildConfigurationWelcomeV2BeforePendingRoles extends GuildConfigurationRoot {
    roles: GuildConfigurationWelcomeV2BeforePendingRole[];
}

export interface GuildConfigurationWelcomeV2BeforePendingRole extends GuildConfigurationRoot {
    id: string;
    type: GuildConfigurationWelcomeV2BeforePendingRoleTargetType;
}

export type GuildConfigurationWelcomeV2BeforePendingRoleTargetType =
    'EVERYONE'
    | 'USER'
    | 'BOT'
    | 'VERIFIED_BOT'
    | 'NOT_VERIFIED_BOT';

export interface GuildConfigurationWelcomeV2AfterPending extends GuildConfigurationRoot {
    message: GuildConfigurationWelcomeV2Message;
    roles: GuildConfigurationWelcomeV2AfterPendingRoles;
}

export interface GuildConfigurationWelcomeV2AfterPendingRoles extends GuildConfigurationRoot {
    roles: GuildConfigurationWelcomeV2AfterPendingRole[];
}

export interface GuildConfigurationWelcomeV2AfterPendingRole extends GuildConfigurationRoot {
    id: string;
}

export interface GuildConfigurationWelcomeV2Message extends GuildConfigurationRoot {
    channel_id: string;
    message: DataMessage;
}

export interface GuildConfigurationGoodbye extends GuildConfigurationRoot {
    channel_id: string;
    message: DataMessage;
}

export interface GuildConfigurationActivity extends GuildConfigurationRoot {
    roles: GuildConfigurationActivityRole[];
}

export interface GuildConfigurationActivityRole extends GuildConfigurationRoot {
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

export interface GuildConfigurationGlobalBan extends GuildConfigurationRoot {
    minimum_evaluate_value: number;
}

export interface GuildConfigurationLevel extends GuildConfigurationRoot {
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

export interface GuildConfigurationLevelRewardRole extends GuildConfigurationRoot {
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

export interface GuildConfigurationTranslate extends GuildConfigurationRoot {
    reaction: boolean;
    disabled: GuildConfigurationAccessControlComponent;
}

export interface GuildConfigurationQuote extends GuildConfigurationRoot {
    reaction: boolean;
    message: boolean;
    other_guild_to_this_guild: boolean;
    this_guild_to_other_guild: boolean;
    disabled: GuildConfigurationAccessControlComponent;
}

export interface GuildConfigurationMusic extends GuildConfigurationRoot {
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

export interface GuildConfigurationLoggingComponent extends GuildConfigurationRoot {
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
