import { database, Guild_Web_Categories } from '@/database';
import { CreateGuildWebCategory, GuildWebCategory } from '@/interfaces/bot';
import { getGuildWebCategory } from '@/libs/bot';

export const createGuildWebCategory = async (guildId: string, data: CreateGuildWebCategory): Promise<GuildWebCategory> => {
    const guildWebCategory = (
        await database
            .insert(Guild_Web_Categories)
            .values({
                guildId: BigInt(guildId),
                slug: data.slug || undefined,
                color: data.color,
                name: data.name,
                description: data.description,
                parentId: data.parentId
            })
            .$returningId()
    )[0];

    return (await getGuildWebCategory(guildWebCategory.id))!;
};
