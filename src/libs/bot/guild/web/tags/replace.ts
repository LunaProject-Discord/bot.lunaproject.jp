import {
    GuildWebTag,
    ReplaceGuildWebTags,
    ReplaceGuildWebTagsCreate,
    ReplaceGuildWebTagsUpdate
} from '@/interfaces/bot';
import { getGuildWebTagsByGuildId } from '@/libs/bot';
import prisma from '@/libs/prisma';
import { ulid } from 'ulid';

export const replaceGuildWebTags = async (guildId: string, data: ReplaceGuildWebTags): Promise<GuildWebTag[]> => {
    const tags = await getGuildWebTagsByGuildId(guildId);

    const updateTags = data.filter((tag): tag is ReplaceGuildWebTagsUpdate => 'id' in tag);
    const createTags = data.filter((tag): tag is ReplaceGuildWebTagsCreate => !('id' in tag));
    const deleteTags = tags.filter((tag) => !updateTags.find((updateTag) => updateTag.id === tag.id));

    await prisma.$transaction([
        ...updateTags.map((tag) => prisma.guild_web_tags.update({
            where: {
                id: tag.id
            },
            data: {
                slug: tag.slug,
                color: tag.color,
                name: tag.name,
                description: tag.description,
                updated_at: new Date()
            }
        })),
        ...createTags.map((tag) => prisma.guild_web_tags.create({
            data: {
                id: ulid(),
                guild_id: BigInt(guildId),
                slug: tag.slug || undefined,
                color: tag.color,
                name: tag.name,
                description: tag.description,
                updated_at: new Date(),
                created_at: new Date()
            }
        })),
        ...deleteTags.map((tag) => prisma.guild_web_tags.delete({
            where: {
                id: tag.id
            }
        }))
    ]);

    return await getGuildWebTagsByGuildId(guildId);
};
