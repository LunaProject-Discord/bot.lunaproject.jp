import {
    CreateGuildWebPageContent,
    GuildWebPage,
    GuildWebPageContent,
    UpdateGuildWebPage,
    UpdateGuildWebPageContent
} from '@/interfaces/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';

export const saveGuildWebPage = async (
    guildId: string,
    pageId: string,
    data: UpdateGuildWebPage
): Promise<GuildWebPage | undefined> => {
    try {
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
    } catch (e) {
        errorWithName('saveGuildWebPage', e);
        return undefined;
    }
};

export const saveGuildWebPageContent = async (
    guildId: string,
    pageId: string,
    data: CreateGuildWebPageContent | UpdateGuildWebPageContent & { id: string }
): Promise<GuildWebPageContent | undefined> => {
    try {
        const prefix = `/api/guilds/${guildId}/web/articles/${pageId}/contents`;

        if ('id' in data) {
            const response = await fetch(
                `${prefix}/${data.id}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                    credentials: 'include'
                }
            );

            if (!response.ok)
                return undefined;

            return response.json();
        }

        const response = await fetch(
            prefix,
            {
                method: 'POST',
                body: JSON.stringify(data),
                credentials: 'include'
            }
        );

        if (!response.ok)
            return undefined;

        return response.json();
    } catch (e) {
        errorWithName('saveGuildWebPageContent', e);
        return undefined;
    }
};

export interface SaveData {
    page: UpdateGuildWebPage;
    content: CreateGuildWebPageContent;
}

export const save = async (guildId: string, pageId: string, data: SaveData): Promise<GuildWebPage | undefined> => {
    const pageContent = await saveGuildWebPageContent(guildId, pageId, data.content);
    if (!pageContent)
        return undefined;

    const page = await saveGuildWebPage(guildId, pageId, data.page);
    if (!page)
        return undefined;

    return page;
};

export interface PublishData {
    page: UpdateGuildWebPage;
    content: UpdateGuildWebPageContent;
}

export const publish = async (
    guildId: string,
    pageId: string,
    pageContentId: string,
    data: PublishData
): Promise<GuildWebPage | undefined> => {
    const pageContent = await saveGuildWebPageContent(guildId, pageId, { id: pageContentId, ...data.content });
    if (!pageContent)
        return undefined;

    const page = await saveGuildWebPage(guildId, pageId, data.page);
    if (!page)
        return undefined;

    return page;
};
