import {
    database,
    Guild_Web_Page_Category,
    Guild_Web_Page_Contents,
    Guild_Web_Page_Tags,
    Guild_Web_Pages
} from '@/database';
import {
    CreateGuildWebPage as OriginalCreateGuildWebPage,
    CreateGuildWebPageContent,
    GuildWebPage
} from '@/interfaces/bot';
import { getGuildWebPage } from '@/libs/bot';

interface CreateGuildWebPage extends Omit<OriginalCreateGuildWebPage, 'content'> {
    content?: (CreateGuildWebPageContent & { user: string; }) | null | undefined;
}

export const createGuildWebPage = async (guildId: string, data: CreateGuildWebPage): Promise<GuildWebPage> => {
    const id = await database.transaction(async (transaction) => {
        const guildWebPage = (
            await transaction
                .insert(Guild_Web_Pages)
                .values({
                    guildId: BigInt(guildId),
                    slug: data.slug || undefined
                })
                .$returningId()
        )[0];

        const content = data.content;
        if (content)
            await transaction
                .insert(Guild_Web_Page_Contents)
                .values({
                    pageId: guildWebPage.id,
                    userId: BigInt(content.user),
                    icon: content.icon,
                    title: content.title,
                    content: content.content,
                    isPublished: content.published,
                    isAutoSave: content.autoSave,
                    comment: content.comment
                });

        const categoryId = data.category;
        if (categoryId)
            await transaction
                .insert(Guild_Web_Page_Category)
                .values({
                    pageId: guildWebPage.id,
                    categoryId
                });

        const tagIds = data.tags || [];
        if (tagIds.length > 0)
            await transaction
                .insert(Guild_Web_Page_Tags)
                .values(
                    tagIds.map((tagId) => ({
                        pageId: guildWebPage.id,
                        tagId
                    }))
                );

        return guildWebPage.id;
    });

    return (await getGuildWebPage(id))!;
};
