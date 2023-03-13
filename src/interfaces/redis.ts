interface RedisSnowflake {
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
    discriminator: string;
    avatar: string | null;
    bot: boolean;
    system: boolean;
    flags: number;
}
