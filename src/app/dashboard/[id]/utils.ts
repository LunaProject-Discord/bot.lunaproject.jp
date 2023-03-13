import { GuildSettings } from '../../../interfaces/bot';

export const saveGuildSettings = async (id: string, settings: Partial<GuildSettings>) => {
    const res = await fetch(
        `/api/guilds/${id}/settings`,
        {
            method: 'PATCH',
            body: JSON.stringify(settings),
            credentials: 'include'
        }
    );

    return res.ok;
};
