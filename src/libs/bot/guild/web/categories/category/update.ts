import { database, Guild_Web_Categories } from '@/database';
import { GuildWebCategory, UpdateGuildWebCategory } from '@/interfaces/bot';
import { getGuildWebCategory } from '@/libs/bot';
import { eq } from 'drizzle-orm';

export const updateGuildWebCategory = async (id: string, data: UpdateGuildWebCategory): Promise<GuildWebCategory> => {
    await database
        .update(Guild_Web_Categories)
        .set({
            slug: data.slug || undefined,
            color: data.color,
            name: data.name,
            description: data.description,
            parentId: data.parentId
        })
        .where(eq(Guild_Web_Categories.id, id));

    return (await getGuildWebCategory(id))!;
};
