import { database, Guild_Web_Categories } from '@/database';
import { eq } from 'drizzle-orm';

export const deleteGuildWebCategory = async (id: string) => {
    await database
        .delete(Guild_Web_Categories)
        .where(eq(Guild_Web_Categories.id, id));
};
