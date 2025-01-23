import { database, Guild_Web_Page_Tags, Guild_Web_Tags } from '@/database';
import { GuildWebTag } from '@/interfaces/bot';
import { fromSQLDate } from '@/utils/date';
import { countDistinct, eq } from 'drizzle-orm';

export const getGuildWebTag = async (tagOrId: typeof Guild_Web_Tags.$inferSelect | string): Promise<GuildWebTag | undefined> => {
    const guildWebTag = typeof tagOrId === 'string' ? await database.query.Guild_Web_Tags.findFirst({
        where: eq(Guild_Web_Tags.id, tagOrId)
    }) : tagOrId;
    if (!guildWebTag)
        return undefined;

    const pageCount = (
        await database
            .select({ value: countDistinct(Guild_Web_Page_Tags.pageId) })
            .from(Guild_Web_Page_Tags)
            .where(eq(Guild_Web_Page_Tags.tagId, guildWebTag.id))
    ).at(0)?.value ?? 0;

    return {
        id: guildWebTag.id,
        guildId: guildWebTag.guildId.toString(),
        slug: guildWebTag.slug || null,
        color: guildWebTag.color,
        name: guildWebTag.name,
        description: guildWebTag.description,
        pageCount,
        updatedAt: fromSQLDate(guildWebTag.updatedAt).toMillis(),
        createdAt: fromSQLDate(guildWebTag.createdAt).toMillis()
    };
};

export * from './create';
export * from './delete';
export * from './update';
