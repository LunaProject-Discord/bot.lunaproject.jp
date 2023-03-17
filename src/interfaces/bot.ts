import { OAuthGuild } from '@lunaproject-discord/web-discord';
import { TimeZone } from '../utils/timezone';
import { DataMessage } from './message';


export interface CalendarEvent {
    title: string;
    description?: string;
    color: string;
    start: Date;
    end: Date;
    allDay?: boolean;
}

export interface PartialUser {
    id: string;
    name?: string;
    discriminator?: string;
    avatar?: string;
}


export interface UserNotification {
    id: number;
    name: string;
    type: 'success' | 'warning' | 'error' | 'information';
    title: string;
    description: string;
    read: boolean;
    updatedAt: number;
    createdAt: number;
}


export interface GuildNotification extends Omit<UserNotification, 'read'> {
    reads: string[];
}


export interface UserCalendarEvent {
    title: string;
    description?: string;
    color: string;
    start: Date;
    end: Date;
    allDay?: boolean;
}


export interface PartialGuildLevel {
    user_id: string;
    level: number;
    xp: number;
}

export interface GuildLevel extends Omit<PartialGuildLevel, 'user_id'> {
    user: PartialUser;
    rank: number;
}


export interface FeaturedGuild {
    guild: OAuthGuild;
    features: GuildFeature[];
}

export type GuildFeature = 'manage' | 'level';


export interface GuildSettings {
    id: string;

    prefix: string;
    nickname: string;
    language: GuildSettingsLanguage;
    timezone: TimeZone;

    commands: GuildSettingsCommands;

    welcome: GuildSettingsWelcome;
    goodbye: GuildSettingsGoodbye;
    activity: GuildSettingsActivity;

    global_chat: GuildSettingsComponent;
    global_ban: GuildSettingsGlobalBan;
    level: GuildSettingsLevel;
    translate: GuildSettingsTranslate;
    vote: GuildSettingsComponent;
    quote: GuildSettingsQuote;
    music: GuildSettingsMusic;
    logging: GuildSettingsLogging;
}

export type GuildSettingsLanguage = 'ja-JP' | 'en-US';

export interface GuildSettingsComponent {
    enabled: boolean;
}

export interface GuildSettingsAccessControlComponent {
    channels: string[];
    roles: string[];
}

export interface GuildSettingsCommands {
    disabled: GuildSettingsAccessControlComponent;
    commands: GuildSettingsCommand[];
}

export interface GuildSettingsCommand {
    enabled: boolean;
    name: string;
    descriptions: GuildSettingsCommandLocalizationText[];
    category: string;
    aliases: string[];
    permissions: string;
    allowed: GuildSettingsAccessControlComponent;
    denied: GuildSettingsAccessControlComponent;
}

export interface GuildSettingsCommandLocalizationText {
    language: string;
    text: string;
}

export interface GuildSettingsWelcome extends GuildSettingsComponent {
    channel_id: string;
    message: DataMessage;
    roles: GuildSettingsWelcomeRole[];
}

export interface GuildSettingsWelcomeRole {
    id: string;
}

export interface GuildSettingsGoodbye extends GuildSettingsComponent {
    channel_id: string;
    message: DataMessage;
}

export interface GuildSettingsActivity extends GuildSettingsComponent {
    roles: GuildSettingsActivityRole[];
}

export interface GuildSettingsActivityRole {
    id: string;
    name: string;
    type: GuildSettingsActivityRoleType;
}

export type GuildSettingsActivityRoleType =
    'PLAYING'
    | 'STREAMING'
    | 'LISTENING'
    | 'WATCHING'
    | 'CUSTOM_STATUS'
    | 'COMPETING';

export interface GuildSettingsGlobalBan extends GuildSettingsComponent {
    minimum_evaluate_value: number;
}

export interface GuildSettingsLevel extends GuildSettingsComponent {
    experience_per_message: number;
    disabled: GuildSettingsAccessControlComponent;
    reward: GuildSettingsLevelReward;
    notification: GuildSettingsLevelNotification;
    leaderboard: GuildSettingsLevelLeaderboard;
}

export interface GuildSettingsLevelReward {
    type: GuildSettingsLevelRewardType;
    remove_role_demoted: boolean;
    roles: GuildSettingsLevelRewardRole[];
}

export type GuildSettingsLevelRewardType = 'STACK_PREVIOUS_ROLES' | 'REMOVE_PREVIOUS_ROLES';

export interface GuildSettingsLevelRewardRole {
    id: string;
    level: number;
}

export interface GuildSettingsLevelNotification {
    type: GuildSettingsLevelNotificationType;
    channel_id: string;
    message: DataMessage;
}

export type GuildSettingsLevelNotificationType = 'DISABLED' | 'DIRECT_MESSAGE' | 'CURRENT_CHANNEL' | 'CUSTOM_CHANNEL';

export interface GuildSettingsLevelLeaderboard {
    public: boolean;
    allow_join: boolean;
    vanity_code: string | null;
}

export interface GuildSettingsTranslate extends GuildSettingsComponent {
    reaction: boolean;
    disabled: GuildSettingsAccessControlComponent;
}

export interface GuildSettingsQuote extends GuildSettingsComponent {
    reaction: boolean;
    message: boolean;
    other_guild_to_this_guild: boolean;
    this_guild_to_other_guild: boolean;
    disabled: GuildSettingsAccessControlComponent;
}

export interface GuildSettingsMusic extends GuildSettingsComponent {
    web_panel: boolean;
    sources: GuildSettingsMusicSources;
}

export interface GuildSettingsMusicSources {
    youtube: boolean;
    niconico: boolean;
    soundcloud: boolean;
    twitch: boolean;
    bandcamp: boolean;
    vimeo: boolean;
}

export interface GuildSettingsLogging {
    enabled: boolean;

    moderation: GuildSettingsLoggingModeration;
    member: GuildSettingsLoggingMember;
    voice: GuildSettingsLoggingVoice;
    category: GuildSettingsLoggingChannel;
    text_channel: GuildSettingsLoggingChannel;
    voice_channel: GuildSettingsLoggingChannel;
    role: GuildSettingsLoggingObject;
    emote: GuildSettingsLoggingObject;
    invite: GuildSettingsLoggingObject;
    webhook: GuildSettingsLoggingObject;
    integration: GuildSettingsLoggingObject;
    message: GuildSettingsLoggingMessage;
}

export interface GuildSettingsLoggingComponent extends GuildSettingsComponent {
    channel_id: string;
    color: string;
}

export interface GuildSettingsLoggingModeration extends GuildSettingsLoggingComponent {
    update: boolean;
    kick: boolean;
    prune: boolean;
    ban: boolean;
    unban: boolean;
}

export interface GuildSettingsLoggingMember extends GuildSettingsLoggingComponent {
    join: boolean;
    leave: boolean;
    update: boolean;
    role_add: boolean;
    role_remove: boolean;
}

export interface GuildSettingsLoggingVoice extends GuildSettingsLoggingComponent {
    join: boolean;
    leave: boolean;
    move: boolean;
    mute: boolean;
    deafen: boolean;
}

export interface GuildSettingsLoggingChannel extends GuildSettingsLoggingComponent {
    create: boolean;
    delete: boolean;
    update: boolean;
    permissions_update: boolean;
}

export interface GuildSettingsLoggingObject extends GuildSettingsLoggingComponent {
    create: boolean;
    delete: boolean;
    update: boolean;
}

export interface GuildSettingsLoggingMessage extends GuildSettingsLoggingComponent {
    update: boolean;
    delete: boolean;
    purge: boolean;
    pin: boolean;
    unpin: boolean;
}
