import { OAuthGuild, OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { COOKIE_TOKEN } from '@utils/cookie';
import { cookies } from 'next/headers';
import { getGuilds as getOriginalGuilds, getUser as getOriginalUser } from '../libs/discord';

export const getUser = async (): Promise<OAuthUser | undefined> => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;

    return getOriginalUser(token);
};

export const getGuilds = async (): Promise<OAuthGuild[]> => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;

    return getOriginalGuilds(token);
};

export const getGuildById = async (id: string): Promise<OAuthGuild | undefined> => (await getGuilds()).find((guild) => guild.id === id);
