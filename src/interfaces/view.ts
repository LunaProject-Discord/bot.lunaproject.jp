import { OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { GuildConfiguration, UserConfiguration } from './bot';
import { LocalizationProps } from './localization';
import { DataGuild, RedisChannel, RedisMember, RedisRole } from './redis';

export interface UserViewProps extends LocalizationProps {
    user: OAuthUser;
}

export interface UserConfigurationViewProps extends UserViewProps {
    configuration: UserConfiguration;
}

export interface GuildViewProps extends LocalizationProps {
    guild: DataGuild;
}

export interface GuildChannelsViewProps extends LocalizationProps {
    channels: RedisChannel[];
}

export interface GuildChannelViewProps extends LocalizationProps {
    channel: RedisChannel;
}

export interface GuildRolesViewProps extends LocalizationProps {
    roles: RedisRole[];
}

export interface GuildRoleViewProps extends LocalizationProps {
    role: RedisRole;
}

export interface GuildMembersViewProps extends LocalizationProps {
    members: RedisMember[];
}

export interface GuildMemberViewProps extends LocalizationProps {
    member: RedisMember;
}

export interface GuildConfigurationViewProps extends GuildViewProps {
    configuration: GuildConfiguration;
}
