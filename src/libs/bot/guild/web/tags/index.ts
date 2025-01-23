import { database, Guild_Web_Page_Tags, Guild_Web_Tags } from '@/database';
import { GuildWebTag } from '@/interfaces/bot';
import { eq } from 'drizzle-orm';
import { getGuildWebTag } from './tag';

export const getGuildWebTagsByGuildId = async (guildId: string): Promise<GuildWebTag[]> => {
    const guildWebTags = await database.query.Guild_Web_Tags.findMany({
        where: eq(Guild_Web_Tags.guildId, BigInt(guildId))
    });

    const tags: GuildWebTag[] = [];
    for (const guildWebTag of guildWebTags) {
        const tag = await getGuildWebTag(guildWebTag.id);
        if (tag)
            tags.push(tag);
    }

    return tags;
};

export const getGuildWebTagsByPageId = async (pageId: string): Promise<GuildWebTag[]> => {
    const guildWebPageTags = await database.query.Guild_Web_Page_Tags.findMany({
        where: eq(Guild_Web_Page_Tags.pageId, pageId)
    });

    const tags: GuildWebTag[] = [];
    for (const guildWebPageTag of guildWebPageTags) {
        const tag = await getGuildWebTag(guildWebPageTag.tagId);
        if (tag)
            tags.push(tag);
    }

    return tags;
};

export * from './replace';
export * from './tag';
