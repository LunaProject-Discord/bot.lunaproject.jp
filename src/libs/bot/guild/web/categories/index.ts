import { database, Guild_Web_Categories } from '@/database';
import { GuildWebCategory } from '@/interfaces/bot';
import { eq } from 'drizzle-orm';
import { getGuildWebCategory } from './category';

export const getGuildWebCategoriesByGuildId = async (guildId: string): Promise<GuildWebCategory[]> => {
    const guildWebCategories = await database.query.Guild_Web_Categories.findMany({
        where: eq(Guild_Web_Categories.guildId, BigInt(guildId))
    });

    const categories: GuildWebCategory[] = [];
    for (const guildWebCategory of guildWebCategories) {
        const category = await getGuildWebCategory(guildWebCategory.id);
        if (category)
            categories.push(category);
    }

    return categories;
};

export * from './category';
export * from './replace';
