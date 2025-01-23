import { database, Guild_Web_Pages } from '@/database';
import { eq } from 'drizzle-orm';

export const deleteGuildWebPage = async (id: string) => {
    await database
        .delete(Guild_Web_Pages)
        .where(eq(Guild_Web_Pages.id, id));
};
