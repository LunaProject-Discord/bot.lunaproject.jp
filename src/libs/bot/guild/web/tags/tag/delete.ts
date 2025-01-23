import { database, Guild_Web_Tags } from '@/database';
import { eq } from 'drizzle-orm';

export const deleteGuildWebTag = async (id: string) => {
    await database
        .delete(Guild_Web_Tags)
        .where(eq(Guild_Web_Tags.id, id));
};
