import { SessionStatus } from '@/interfaces/bot';

export interface RedisSnowflake {
    id: string;
}

export interface RedisGuild extends RedisSnowflake {
    name: string;
    description: string | null;
    icon: string | null;
    splash: string | null;
    banner: string | null;
    features: string[];
    owner: string;
    rules_channel_id: string | null;
    channels: string[];
    roles: string[];
    members: string[];
}

export interface DataGuild extends Omit<RedisGuild, 'channels' | 'roles' | 'members'> {
    channels: RedisChannel[];
    roles: RedisRole[];
    members: RedisMember[];
}

export interface RedisChannel extends RedisSnowflake {
    type: number;
    guild_id: string;
    parent_id: string | null;
    position: number;
    name: string;
    topic: string | null;
    nsfw: boolean | null;
}

export interface RedisRole extends RedisSnowflake {
    guild_id: string;
    position: number;
    name: string;
    color: number;
    icon: string | null;
    unicode_emoji: string | null;
    permissions: string;
    tags: RedisRoleTags;
}

export interface RedisRoleTags {
    bot_id: string | null;
    integration_id: string | null;
    boost: boolean;
    linked_role: boolean;
}

export interface RedisMember extends RedisSnowflake {
    user: RedisUser;
    guild_id: string;
    nick: string | null;
    avatar: string | null;
    roles: string[];
    permissions: string;
    pending: boolean;
}

export interface RedisUser extends RedisSnowflake {
    name: string;
    display_name: string | null;
    discriminator: string;
    avatar: string | null;
    bot: boolean;
    system: boolean;
    flags: number;
}

export interface RedisUserGuilds extends RedisSnowflake {
    guilds: RedisUserGuild[];
}

export interface RedisUserGuild extends RedisSnowflake {
    owner: boolean;
    permissions: string;
}

export interface RedisStatus {
    id: number;
    status: SessionStatus;
    ping: number;
}

export interface RedisCommand {
    index: number;
    name: string;
    description: string;
    category: string;
    aliases: string[];
    usages: string[];
    user_permissions: string;
    bot_permissions: string;
}
