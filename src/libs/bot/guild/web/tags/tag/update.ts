import { database, Guild_Web_Tags } from '@/database';
import { GuildWebTag, UpdateGuildWebTag } from '@/interfaces/bot';
import { getGuildWebTag } from '@/libs/bot';
import { eq } from 'drizzle-orm';

export const updateGuildWebTag = async (id: string, data: UpdateGuildWebTag): Promise<GuildWebTag> => {
    await database
        .update(Guild_Web_Tags)
        .set({
            slug: data.slug || undefined,
            color: data.color,
            name: data.name,
            description: data.description
        })
        .where(eq(Guild_Web_Tags.id, id));

    return (await getGuildWebTag(id))!;
};
