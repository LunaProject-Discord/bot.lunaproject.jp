import { GuildWebTag, UpdateGuildWebTag } from '@/interfaces/bot';
import { getGuildWebTag } from '@/libs/bot';
import prisma from '@/libs/prisma';

export const updateGuildWebTag = async (tagId: string, data: UpdateGuildWebTag): Promise<GuildWebTag> => {
    const guildWebTag = await prisma.guild_web_tags.update({
        where: {
            id: tagId
        },
        data: {
            slug: data.slug,
            color: data.color,
            name: data.name,
            description: data.description,
            updated_at: new Date()
        }
    });

    return (await getGuildWebTag(guildWebTag))!;
};
