import prisma from '@/libs/prisma';

export const deleteGuildWebCategory = async (categoryId: string) => {
    await prisma.guild_web_categories.delete({
        where: {
            id: categoryId
        }
    });
};
