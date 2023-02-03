import { TimeZone } from '../utils/timezone';
import { OAuthGuild } from './discord';
import { SendableMessage } from './message';

export interface PartialUser {
    id: string;
    name?: string;
    discriminator?: string;
    avatar?: string;
}


export interface PartialGuildLevel {
    user_id: string;
    level: number;
    xp: number;
}

export interface GuildLevel extends Omit<PartialGuildLevel, 'user_id'> {
    user: PartialUser;
    rank: number;
    level: number;
    xp: number;
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
    message: SendableMessage;
    roles: GuildSettingsWelcomeRole[];
}

export interface GuildSettingsWelcomeRole {
    id: string;
}

export interface GuildSettingsGoodbye extends GuildSettingsComponent {
    channel_id: string;
    message: SendableMessage;
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
    roles: GuildSettingsLevelRole[];
}

export type GuildSettingsLevelRewardType = 'STACK_PREVIOUS_ROLES' | 'REMOVE_PREVIOUS_ROLES';

export interface GuildSettingsLevelRole {
    id: string;
    level: number;
}

export interface GuildSettingsLevelNotification {
    type: GuildSettingsLevelNotificationType;
    channel_id: string;
    message: SendableMessage;
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
    mappings: GuildSettingsTranslateMapping[];
}

export interface GuildSettingsTranslateMapping extends GuildSettingsComponent {
    country: string;
    languages: string[];
    __choices: string[];
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

export interface GuildSettingsLoggingModeration {
    channel_id: string;

    update: boolean;
    kick: boolean;
    prune: boolean;
    ban: boolean;
    unban: boolean;
}

export interface GuildSettingsLoggingMember {
    channel_id: string;

    join: boolean;
    leave: boolean;
    update: boolean;
    role_add: boolean;
    role_remove: boolean;
}

export interface GuildSettingsLoggingVoice {
    channel_id: string;

    join: boolean;
    leave: boolean;
    move: boolean;
    mute: boolean;
    deafen: boolean;
}

export interface GuildSettingsLoggingChannel {
    channel_id: string;

    create: boolean;
    delete: boolean;
    update: boolean;
    permissions_update: boolean;
}

export interface GuildSettingsLoggingObject {
    channel_id: string;

    create: boolean;
    delete: boolean;
    update: boolean;
}

export interface GuildSettingsLoggingMessage {
    channel_id: string;

    update: boolean;
    delete: boolean;
    purge: boolean;
    pin: boolean;
    unpin: boolean;
}
