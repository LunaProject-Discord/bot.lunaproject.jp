import { database, Guild_Web_Page_Contents } from '@/database';
import { GuildWebPageContent, UpdateGuildWebPageContent } from '@/interfaces/bot';
import { getGuildWebPageContent } from '@/libs/bot';
import { toSQLDate } from '@/utils/date';
import { eq } from 'drizzle-orm';

export const updateGuildWebPageContent = async (id: string, data: UpdateGuildWebPageContent): Promise<GuildWebPageContent> => {
    await database
        .update(Guild_Web_Page_Contents)
        .set({
            isPublished: data.published,
            isAutoSave: (data.published !== undefined || data.comment !== undefined) ? false : undefined,
            comment: data.comment,
            deletedAt: data.deleted ? toSQLDate() : null
        })
        .where(eq(Guild_Web_Page_Contents.id, id));

    return (await getGuildWebPageContent(id))!;
};
