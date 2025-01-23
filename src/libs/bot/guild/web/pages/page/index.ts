import { database, Guild_Web_Pages } from '@/database';
import { GuildWebPage } from '@/interfaces/bot';
import { getGuildWebCategoryByPageId, getGuildWebPageContentsByPageId, getGuildWebTagsByPageId } from '@/libs/bot';
import { fromSQLDate } from '@/utils/date';
import { eq, or } from 'drizzle-orm';

export const getGuildWebPage = async (pageOrIdOrSlug: typeof Guild_Web_Pages.$inferSelect | string): Promise<GuildWebPage | undefined> => {
    const guildWebPage = typeof pageOrIdOrSlug === 'string' ? await database.query.Guild_Web_Pages.findFirst({
        where: or(
            eq(Guild_Web_Pages.id, pageOrIdOrSlug),
            eq(Guild_Web_Pages.slug, pageOrIdOrSlug)
        )
    }) : pageOrIdOrSlug;
    if (!guildWebPage)
        return undefined;

    const id = guildWebPage.id;
    const contents = await getGuildWebPageContentsByPageId(id);
    const contentId = guildWebPage.contentId || undefined;
    const content = contents.find((content) => content.id === contentId);
    const category = await getGuildWebCategoryByPageId(id) || null;
    const tags = await getGuildWebTagsByPageId(id);

    return {
        id,
        guildId: guildWebPage.guildId.toString(),
        contentId: content?.id || null,
        content: content || null,
        contents: [
            ...contents.toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1).slice(0, 5),
            content
        ].filter((content) => content !== undefined),
        slug: guildWebPage.slug || null,
        category,
        tags,
        published: contents.some((content) => content.published),
        deletedAt: guildWebPage.deletedAt ? fromSQLDate(guildWebPage.deletedAt).toMillis() : null,
        updatedAt: fromSQLDate(guildWebPage.updatedAt).toMillis(),
        createdAt: fromSQLDate(guildWebPage.createdAt).toMillis()
    };
};

export * from './contents';
export * from './create';
export * from './delete';
export * from './update';
