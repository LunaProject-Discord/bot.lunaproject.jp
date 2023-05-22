import { GuildConfiguration } from '../../../interfaces/bot';

export const saveGuildConfiguration = async (id: string, configuration: Partial<GuildConfiguration>) => {
    const res = await fetch(
        `/api/guilds/${id}/configuration`,
        {
            method: 'PATCH',
            body: JSON.stringify(configuration),
            credentials: 'include'
        }
    );

    return res.ok;
};
