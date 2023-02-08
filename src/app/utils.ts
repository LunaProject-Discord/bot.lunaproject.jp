import {
    getGuilds as getOriginalGuilds,
    getUser as getOriginalUser,
    OAuthGuild,
    OAuthUser
} from '@lunaproject-discord/web-discord';
import { cookies } from 'next/headers';
import { getMutualGuilds as getOriginalMutualGuilds } from '../libs/bot';

export const getUser = async (): Promise<OAuthUser | undefined> => {
    const nextCookies = cookies();
    const token = nextCookies.get('token')?.value;

    return getOriginalUser(token);
};

export const getGuilds = async (): Promise<OAuthGuild[]> => {
    const nextCookies = cookies();
    const token = nextCookies.get('token')?.value;

    return getOriginalGuilds(token);
};

export const getGuildById = async (id: string): Promise<OAuthGuild | undefined> => (await getGuilds()).find((guild) => guild.id === id);

export const getMutualGuilds = async (): Promise<OAuthGuild[]> => {
    const user = await getUser();
    if (!user)
        return [];

    return getOriginalMutualGuilds(user.id);
};

// export const getGuildSettings = cache(async (id: string): Promise<GuildSettings | undefined> => getOriginalGuildSettings(id));
