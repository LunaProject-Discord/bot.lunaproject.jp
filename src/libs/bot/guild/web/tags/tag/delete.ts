import prisma from '@/libs/prisma';

export const deleteGuildWebTag = async (tagId: string) => {
    await prisma.guild_web_tags.delete({
        where: {
            id: tagId
        }
    });
};
