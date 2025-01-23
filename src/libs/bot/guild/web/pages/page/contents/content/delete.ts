import { database, Guild_Web_Page_Contents } from '@/database';
import { eq } from 'drizzle-orm';

export const deleteGuildWebPageContent = async (id: string) => {
    await database
        .delete(Guild_Web_Page_Contents)
        .where(eq(Guild_Web_Page_Contents.id, id));
};
