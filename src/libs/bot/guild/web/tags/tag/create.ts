import { database, Guild_Web_Tags } from '@/database';
import { CreateGuildWebTag, GuildWebTag } from '@/interfaces/bot';
import { getGuildWebTag } from '@/libs/bot';

export const createGuildWebTag = async (guildId: string, data: CreateGuildWebTag): Promise<GuildWebTag> => {
    const guildWebTag = (
        await database
            .insert(Guild_Web_Tags)
            .values({
                guildId: BigInt(guildId),
                slug: data.slug || undefined,
                color: data.color,
                name: data.name,
                description: data.description
            })
            .$returningId()
    )[0];

    return (await getGuildWebTag(guildWebTag.id))!;
};
