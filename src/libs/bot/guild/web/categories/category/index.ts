import { database, Guild_Web_Categories, Guild_Web_Page_Category } from '@/database';
import { GuildWebCategory } from '@/interfaces/bot';
import { fromSQLDate } from '@/utils/date';
import { countDistinct, eq } from 'drizzle-orm';

export const getGuildWebCategory = async (categoryOrId: typeof Guild_Web_Categories.$inferSelect | string): Promise<GuildWebCategory | undefined> => {
    const guildWebCategory = typeof categoryOrId === 'string' ? await database.query.Guild_Web_Categories.findFirst({
        where: eq(Guild_Web_Categories.id, categoryOrId)
    }) : categoryOrId;
    if (!guildWebCategory)
        return undefined;

    const pageCount = (
        await database
            .select({ value: countDistinct(Guild_Web_Page_Category.pageId) })
            .from(Guild_Web_Page_Category)
            .where(eq(Guild_Web_Page_Category.categoryId, guildWebCategory.id))
    ).at(0)?.value ?? 0;

    const parentId = guildWebCategory.parentId || undefined;
    const parent = parentId ? await getGuildWebCategory(parentId) : undefined;
    return {
        id: guildWebCategory.id,
        guildId: guildWebCategory.guildId.toString(),
        slug: guildWebCategory.slug || null,
        color: guildWebCategory.color,
        name: guildWebCategory.name,
        description: guildWebCategory.description,
        parentId: parent?.id || null,
        parent: parent || null,
        pageCount,
        updatedAt: fromSQLDate(guildWebCategory.updatedAt).toMillis(),
        createdAt: fromSQLDate(guildWebCategory.createdAt).toMillis()
    };
};

export const getGuildWebCategoryByPageId = async (pageId: string): Promise<GuildWebCategory | undefined> => {
    const guildWebPageCategory = await database.query.Guild_Web_Page_Category.findFirst({
        where: eq(Guild_Web_Page_Category.pageId, pageId)
    });
    if (!guildWebPageCategory)
        return undefined;

    return await getGuildWebCategory(guildWebPageCategory.categoryId);
};

export * from './create';
export * from './delete';
export * from './update';
