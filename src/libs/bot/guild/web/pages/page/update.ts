import { database, Guild_Web_Page_Category, Guild_Web_Page_Tags, Guild_Web_Pages } from '@/database';
import { GuildWebPage, UpdateGuildWebPage } from '@/interfaces/bot';
import { getGuildWebPage } from '@/libs/bot';
import { toSQLDate } from '@/utils/date';
import { eq } from 'drizzle-orm';

export const updateGuildWebPage = async (id: string, data: UpdateGuildWebPage): Promise<GuildWebPage> => {
    await database
        .update(Guild_Web_Pages)
        .set({
            contentId: data.content,
            slug: data.slug,
            deletedAt: data.deleted ? toSQLDate() : null
        })
        .where(eq(Guild_Web_Pages.id, id));

    const guildWebPage = (await getGuildWebPage(id))!;

    const categoryId = data.category;
    if (categoryId !== undefined) {
        if (categoryId) {
            await database
                .insert(Guild_Web_Page_Category)
                .values({
                    pageId: id,
                    categoryId
                })
                .onDuplicateKeyUpdate({
                    set: {
                        categoryId
                    }
                });
        } else {
            if (guildWebPage.category)
                await database
                    .delete(Guild_Web_Page_Category)
                    .where(eq(Guild_Web_Page_Category.pageId, id));
        }
    }

    const tagIds = data.tags;
    if (tagIds) {
        if (guildWebPage.tags.length > 0)
            await database
                .delete(Guild_Web_Page_Tags)
                .where(eq(Guild_Web_Page_Tags.pageId, id));

        if (tagIds.length > 0)
            await database
                .insert(Guild_Web_Page_Tags)
                .values(
                    tagIds.map(tagId => ({
                        pageId: id,
                        tagId
                    }))
                );
    }

    return (await getGuildWebPage(id))!;
};
