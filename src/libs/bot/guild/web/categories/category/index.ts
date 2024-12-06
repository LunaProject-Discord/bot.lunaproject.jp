import { GuildWebCategory } from '@/interfaces/bot';
import prisma, { guild_web_categories } from '@/libs/prisma';

export const getGuildWebCategory = async (categoryOrId: guild_web_categories | string): Promise<GuildWebCategory | undefined> => {
    const guildWebCategory = typeof categoryOrId === 'string' ? await prisma.guild_web_categories.findUnique({
        where: {
            id: categoryOrId
        }
    }) : categoryOrId;

    if (!guildWebCategory)
        return undefined;

    const parentId = guildWebCategory.parent_id ?? undefined;

    return {
        id: guildWebCategory.id,
        guildId: guildWebCategory.guild_id.toString(),
        slug: guildWebCategory.slug || undefined,
        color: guildWebCategory.color,
        name: guildWebCategory.name,
        description: guildWebCategory.description,
        parentId,
        parent: parentId ? await getGuildWebCategory(parentId) : undefined,
        updatedAt: guildWebCategory.updated_at,
        createdAt: guildWebCategory.created_at
    };
};

export const getGuildWebCategoryByPageId = async (pageId: string): Promise<GuildWebCategory | undefined> => {
    const guildWebCategory = await prisma.guild_web_page_category.findUnique({
        where: {
            page_id: pageId
        },
        include: {
            guild_web_categories: true
        }
    });

    if (!guildWebCategory)
        return undefined;

    return await getGuildWebCategory(guildWebCategory.guild_web_categories);
};

export * from './create';
export * from './delete';
export * from './update';
