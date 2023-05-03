import Redis from 'ioredis';
import {
    DataGuild,
    RedisChannel,
    RedisGuild,
    RedisMember,
    RedisRole,
    RedisUser,
    RedisUserGuild,
    RedisUserGuildList
} from '../interfaces/redis';

const HASH_GUILDS = 'guilds';
const HASH_CHANNELS = 'channels';
const HASH_ROLES = 'roles';
const HASH_MEMBERS = 'members';
const HASH_USERS = 'users';
const HASH_USERS_GUILDS = 'users_guilds';

const PUBSUB_USERS_GUILDS = HASH_USERS_GUILDS;
const PUBSUB_GUILDS_SETTINGS = 'guilds_settings';
const PUBSUB_USERS_SETTINGS = 'users_settings';

const redis = new Redis({
    port: Number(process.env.REDIS_PORT || 6379),
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

export const getGuildById = async (id: string): Promise<DataGuild | undefined> => {
    const data = await redis.hget(HASH_GUILDS, id);
    if (!data)
        return undefined;

    const guild: RedisGuild = JSON.parse(data);
    return {
        ...guild,
        channels: await getChannels(guild.id),
        roles: await getRoles(guild.id),
        members: await getMembers(guild.id)
    };
};

export const getChannels = async (guildId: string): Promise<RedisChannel[]> => {
    const channels = await redis.hgetall(`${HASH_CHANNELS}/${guildId}`);
    if (!channels)
        return [];

    return Object.values(channels).map((channel) => JSON.parse(channel));
};

export const getChannelById = async (id: string, guildId: string): Promise<RedisChannel | undefined> => {
    const data = await redis.hget(`${HASH_CHANNELS}/${guildId}`, id);
    if (!data)
        return undefined;

    return JSON.parse(data);
};

export const getRoles = async (guildId: string): Promise<RedisRole[]> => {
    const roles = await redis.hgetall(`${HASH_ROLES}/${guildId}`);
    if (!roles)
        return [];

    return Object.values(roles).map((role) => JSON.parse(role));
};

export const getRoleById = async (id: string, guildId: string): Promise<RedisRole | undefined> => {
    const data = await redis.hget(`${HASH_ROLES}/${guildId}`, id);
    if (!data)
        return undefined;

    return JSON.parse(data);
};

export const getMembers = async (guildId: string): Promise<RedisMember[]> => {
    const members = await redis.hgetall(`${HASH_MEMBERS}/${guildId}`);
    if (!members)
        return [];

    return Object.values(members).map((member) => JSON.parse(member));
};

export const getMemberById = async (id: string, guildId: string): Promise<RedisMember | undefined> => {
    const data = await redis.hget(`${HASH_MEMBERS}/${guildId}`, id);
    if (!data)
        return undefined;

    return JSON.parse(data);
};

export const getUserById = async (id: string): Promise<RedisUser | undefined> => {
    const data = await redis.hget(HASH_USERS, id);
    if (!data)
        return undefined;

    return JSON.parse(data);
};

export const getUserGuildListById = async (id: string): Promise<RedisUserGuildList | undefined> => {
    const data = await redis.hget(HASH_USERS_GUILDS, id);
    if (!data)
        return undefined;

    return JSON.parse(data);
};

export const requestUserGuildListById = async (id: string): Promise<void> => {
    await redis.publish(PUBSUB_USERS_GUILDS, id);
};

const getUserGuilds = async (id: string): Promise<RedisUserGuild[] | undefined> => (await getUserGuildListById(id))?.guilds;

export const getAndRequestUserGuildListById = async (id: string): Promise<RedisUserGuild[]> => {
    const guilds = await getUserGuilds(id);

    await requestUserGuildListById(id);
    if (!guilds) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 5));
        return await getUserGuilds(id) ?? [];
    }

    return guilds;
};

export const updateGuildSettingsById = async (id: string): Promise<void> => {
    await redis.publish(PUBSUB_GUILDS_SETTINGS, id);
};

export const updateUserSettingsById = async (id: string): Promise<void> => {
    await redis.publish(PUBSUB_USERS_SETTINGS, id);
};
