import { CreateGuildWebPageContent, GuildWebPage, GuildWebPageContent, UpdateGuildWebPage } from '@/interfaces/bot';

export const saveGuildWebPage = async (
    guildId: string,
    pageId: string,
    data: UpdateGuildWebPage
): Promise<GuildWebPage | undefined> => {
    const response = await fetch(
        `/api/guilds/${guildId}/web/articles/${pageId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(data),
            credentials: 'include'
        }
    );

    if (!response.ok)
        return undefined;

    return response.json();
};

export const saveGuildWebPageContent = async (
    guildId: string,
    pageId: string,
    data: CreateGuildWebPageContent
): Promise<GuildWebPageContent | undefined> => {
    const response = await fetch(
        `/api/guilds/${guildId}/web/articles/${pageId}/contents`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include'
        }
    );

    if (!response.ok)
        return undefined;

    return response.json();
};
