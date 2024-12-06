import { GuildWebTag } from '@/interfaces/bot';
import prisma from '@/libs/prisma';
import { getGuildWebTag } from './tag';

export const getGuildWebTagsByGuildId = async (guildId: string): Promise<GuildWebTag[]> => {
    const guildWebTags = await prisma.guild_web_tags.findMany({
        where: {
            guild_id: BigInt(guildId)
        }
    });

    const tags: GuildWebTag[] = [];
    for (const guildWebTag of guildWebTags) {
        const tag = await getGuildWebTag(guildWebTag);
        if (tag)
            tags.push(tag);
    }

    return tags;
};

export const getGuildWebTagsByPageId = async (pageId: string): Promise<GuildWebTag[]> => {
    const guildWebTags = await prisma.guild_web_page_tags.findMany({
        where: {
            page_id: pageId
        },
        include: {
            guild_web_tags: true
        }
    });

    const tags: GuildWebTag[] = [];
    for (const guildWebTag of guildWebTags) {
        const tag = await getGuildWebTag(guildWebTag.guild_web_tags);
        if (tag)
            tags.push(tag);
    }

    return tags;
};

export * from './replace';
export * from './tag';
