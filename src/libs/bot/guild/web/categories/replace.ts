import { database, Guild_Web_Categories } from '@/database';
import {
    GuildWebCategory,
    ReplaceGuildWebCategories,
    ReplaceGuildWebCategoriesCreate,
    ReplaceGuildWebCategoriesUpdate
} from '@/interfaces/bot';
import { getGuildWebCategoriesByGuildId } from '@/libs/bot';
import { and, eq } from 'drizzle-orm';

export const replaceGuildWebCategories = async (guildId: string, data: ReplaceGuildWebCategories): Promise<GuildWebCategory[]> => {
    const categories = await getGuildWebCategoriesByGuildId(guildId);

    const updateCategories = data.filter((category): category is ReplaceGuildWebCategoriesUpdate => 'id' in category);
    const createCategories = data.filter((category): category is ReplaceGuildWebCategoriesCreate => !('id' in category));
    const deleteCategories = categories.filter((category) => !updateCategories.some((updateCategory) => updateCategory.id === category.id));

    await database.transaction(async (transaction) => {
        for (const category of updateCategories) {
            if (Object.keys(category).length < 2)
                continue;

            await transaction
                .update(Guild_Web_Categories)
                .set({
                    slug: category.slug || undefined,
                    color: category.color,
                    name: category.name,
                    description: category.description,
                    parentId: category.parentId
                })
                .where(
                    and(
                        eq(Guild_Web_Categories.id, category.id),
                        eq(Guild_Web_Categories.guildId, BigInt(guildId))
                    )
                );
        }

        if (createCategories.length > 0)
            await transaction
                .insert(Guild_Web_Categories)
                .values(
                    createCategories.map((category) => ({
                        guildId: BigInt(guildId),
                        slug: category.slug || undefined,
                        color: category.color,
                        name: category.name,
                        description: category.description,
                        parentId: category.parentId
                    }))
                );

        for (const category of deleteCategories)
            await transaction
                .delete(Guild_Web_Categories)
                .where(
                    and(
                        eq(Guild_Web_Categories.id, category.id),
                        eq(Guild_Web_Categories.guildId, BigInt(guildId))
                    )
                );
    });

    return await getGuildWebCategoriesByGuildId(guildId);
};
