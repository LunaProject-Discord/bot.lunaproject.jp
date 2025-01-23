import { database, Guild_Web_Page_Contents } from '@/database';
import { GuildWebPageContent } from '@/interfaces/bot';
import { fromSQLDate } from '@/utils/date';
import { eq } from 'drizzle-orm';

export const getGuildWebPageContent = async (pageContentOrId: typeof Guild_Web_Page_Contents.$inferSelect | string): Promise<GuildWebPageContent | undefined> => {
    const guildWebPageContent = typeof pageContentOrId === 'string' ? await database.query.Guild_Web_Page_Contents.findFirst({
        where: eq(Guild_Web_Page_Contents.id, pageContentOrId)
    }) : pageContentOrId;
    if (!guildWebPageContent)
        return undefined;

    return {
        id: guildWebPageContent.id,
        pageId: guildWebPageContent.pageId,
        userId: guildWebPageContent.userId.toString(),
        thumbnail: guildWebPageContent.thumbnail || null,
        icon: guildWebPageContent.icon || null,
        title: guildWebPageContent.title,
        content: guildWebPageContent.content,
        published: guildWebPageContent.isPublished,
        autoSave: guildWebPageContent.isAutoSave,
        comment: guildWebPageContent.comment,
        deletedAt: guildWebPageContent.deletedAt ? fromSQLDate(guildWebPageContent.deletedAt).toMillis() : null,
        updatedAt: fromSQLDate(guildWebPageContent.updatedAt).toMillis(),
        createdAt: fromSQLDate(guildWebPageContent.createdAt).toMillis()
    };
};

export * from './create';
export * from './delete';
export * from './update';
