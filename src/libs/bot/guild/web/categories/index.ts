import { GuildWebCategory } from '@/interfaces/bot';
import prisma from '@/libs/prisma';
import { getGuildWebCategory } from './category';

export const getGuildWebCategoriesByGuildId = async (guildId: string): Promise<GuildWebCategory[]> => {
    const guildWebCategories = await prisma.guild_web_categories.findMany({
        where: {
            guild_id: BigInt(guildId)
        }
    });

    const categories: GuildWebCategory[] = [];
    for (const guildWebCategory of guildWebCategories) {
        const category = await getGuildWebCategory(guildWebCategory);
        if (category)
            categories.push(category);
    }

    return categories;
};

export * from './category';
export * from './replace';
