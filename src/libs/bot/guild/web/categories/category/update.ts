import { GuildWebCategory, UpdateGuildWebCategory } from '@/interfaces/bot';
import { getGuildWebCategory } from '@/libs/bot';
import prisma from '@/libs/prisma';

export const updateGuildWebCategory = async (categoryId: string, data: UpdateGuildWebCategory): Promise<GuildWebCategory> => {
    const guildWebCategory = await prisma.guild_web_categories.update({
        where: {
            id: categoryId
        },
        data: {
            slug: data.slug,
            color: data.color,
            name: data.name,
            description: data.description,
            parent_id: data.parentId,
            updated_at: new Date()
        }
    });

    return (await getGuildWebCategory(guildWebCategory))!;
};
