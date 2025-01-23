import { database, Guild_Web_Page_Contents } from '@/database';
import { CreateGuildWebPageContent as OriginalCreateGuildWebPageContent, GuildWebPageContent } from '@/interfaces/bot';
import { getGuildWebPageContent } from '@/libs/bot';

interface CreateGuildWebPageContent extends OriginalCreateGuildWebPageContent {
    user: string;
}

export const createGuildWebPageContent = async (pageId: string, data: CreateGuildWebPageContent): Promise<GuildWebPageContent> => {
    const guildWebPageContent = (
        await database
            .insert(Guild_Web_Page_Contents)
            .values({
                pageId,
                userId: BigInt(data.user),
                thumbnail: data.thumbnail || null,
                icon: data.icon || null,
                title: data.title,
                content: data.content,
                isPublished: data.published,
                isAutoSave: data.autoSave,
                comment: data.comment
            })
            .$returningId()
    )[0];

    return (await getGuildWebPageContent(guildWebPageContent.id))!;
};
