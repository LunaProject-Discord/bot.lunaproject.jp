import { database, Guild_Web_Tags } from '@/database';
import {
    GuildWebTag,
    ReplaceGuildWebTags,
    ReplaceGuildWebTagsCreate,
    ReplaceGuildWebTagsUpdate
} from '@/interfaces/bot';
import { getGuildWebTagsByGuildId } from '@/libs/bot';
import { and, eq } from 'drizzle-orm';

export const replaceGuildWebTags = async (guildId: string, data: ReplaceGuildWebTags): Promise<GuildWebTag[]> => {
    const tags = await getGuildWebTagsByGuildId(guildId);

    const updateTags = data.filter((tag): tag is ReplaceGuildWebTagsUpdate => 'id' in tag);
    const createTags = data.filter((tag): tag is ReplaceGuildWebTagsCreate => !('id' in tag));
    const deleteTags = tags.filter((tag) => !updateTags.some((updateTag) => updateTag.id === tag.id));

    await database.transaction(async (transaction) => {
        for (const tag of updateTags) {
            if (Object.keys(tag).length < 2)
                continue;

            await transaction
                .update(Guild_Web_Tags)
                .set({
                    slug: tag.slug || undefined,
                    color: tag.color,
                    name: tag.name,
                    description: tag.description
                })
                .where(
                    and(
                        eq(Guild_Web_Tags.id, tag.id),
                        eq(Guild_Web_Tags.guildId, BigInt(guildId))
                    )
                );
        }

        if (createTags.length > 0)
            await transaction
                .insert(Guild_Web_Tags)
                .values(
                    createTags.map((tag) => ({
                        guildId: BigInt(guildId),
                        slug: tag.slug || undefined,
                        color: tag.color,
                        name: tag.name,
                        description: tag.description
                    }))
                );

        for (const tag of deleteTags)
            await transaction
                .delete(Guild_Web_Tags)
                .where(
                    and(
                        eq(Guild_Web_Tags.id, tag.id),
                        eq(Guild_Web_Tags.guildId, BigInt(guildId))
                    )
                );
    });

    return await getGuildWebTagsByGuildId(guildId);
};
