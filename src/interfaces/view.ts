import { OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { GuildSettings } from './bot';
import { Translations } from './localization';
import { DataGuild, RedisChannel, RedisMember, RedisRole } from './redis';

export interface TranslatableViewProps {
    translations: Translations;
}

export interface UserViewProps extends TranslatableViewProps {
    user: OAuthUser;
}

export interface GuildViewProps extends TranslatableViewProps {
    guild: DataGuild;
}

export interface GuildChannelListViewProps extends TranslatableViewProps {
    channels: RedisChannel[];
}

export interface GuildRoleListViewProps extends TranslatableViewProps {
    roles: RedisRole[];
}

export interface GuildMemberListViewProps extends TranslatableViewProps {
    members: RedisMember[];
}

export interface GuildSettingsViewProps extends GuildViewProps {
    settings: GuildSettings;
}
