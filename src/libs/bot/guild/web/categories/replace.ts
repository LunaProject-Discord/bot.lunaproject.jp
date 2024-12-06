import {
    GuildWebCategory,
    ReplaceGuildWebCategories,
    ReplaceGuildWebCategoriesCreate,
    ReplaceGuildWebCategoriesUpdate
} from '@/interfaces/bot';
import { getGuildWebCategoriesByGuildId } from '@/libs/bot';
import prisma from '@/libs/prisma';
import { ulid } from 'ulid';

export const replaceGuildWebCategories = async (guildId: string, data: ReplaceGuildWebCategories): Promise<GuildWebCategory[]> => {
    const categories = await getGuildWebCategoriesByGuildId(guildId);

    const updateCategories = data.filter((category): category is ReplaceGuildWebCategoriesUpdate => 'id' in category);
    const createCategories = data.filter((category): category is ReplaceGuildWebCategoriesCreate => !('id' in category));
    const deleteCategories = categories.filter((category) => !updateCategories.find((updateCategory) => updateCategory.id === category.id));

    await prisma.$transaction([
        ...updateCategories.map((category) => prisma.guild_web_categories.update({
            where: {
                id: category.id
            },
            data: {
                slug: category.slug,
                color: category.color,
                name: category.name,
                description: category.description,
                parent_id: category.parentId,
                updated_at: new Date()
            }
        })),
        ...createCategories.map((category) => prisma.guild_web_categories.create({
            data: {
                id: ulid(),
                guild_id: BigInt(guildId),
                slug: category.slug || undefined,
                color: category.color,
                name: category.name,
                description: category.description,
                parent_id: category.parentId,
                updated_at: new Date(),
                created_at: new Date()
            }
        })),
        ...deleteCategories.map((category) => prisma.guild_web_categories.delete({
            where: {
                id: category.id
            }
        }))
    ]);

    return await getGuildWebCategoriesByGuildId(guildId);
};
