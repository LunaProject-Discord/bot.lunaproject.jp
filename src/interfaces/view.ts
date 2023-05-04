import { OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { GuildSettings } from './bot';
import { LocalizationProps } from './localization';
import { DataGuild, RedisChannel, RedisMember, RedisRole } from './redis';

export interface UserViewProps extends LocalizationProps {
    user: OAuthUser;
}

export interface GuildViewProps extends LocalizationProps {
    guild: DataGuild;
}

export interface GuildChannelsViewProps extends LocalizationProps {
    channels: RedisChannel[];
}

export interface GuildRolesViewProps extends LocalizationProps {
    roles: RedisRole[];
}

export interface GuildMembersViewProps extends LocalizationProps {
    members: RedisMember[];
}

export interface GuildSettingsViewProps extends GuildViewProps {
    settings: GuildSettings;
}
