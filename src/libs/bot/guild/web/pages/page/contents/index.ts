import { database, Guild_Web_Page_Contents } from '@/database';
import { GuildWebPageContent } from '@/interfaces/bot';
import { getGuildWebPageContent } from '@/libs/bot';
import { eq } from 'drizzle-orm';

export const getGuildWebPageContentsByPageId = async (pageId: string): Promise<GuildWebPageContent[]> => {
    const guildWebPageContents = await database.query.Guild_Web_Page_Contents.findMany({
        where: eq(Guild_Web_Page_Contents.pageId, pageId)
    });

    const contents: GuildWebPageContent[] = [];
    for (const guildWebPageContent of guildWebPageContents) {
        const content = await getGuildWebPageContent(guildWebPageContent);
        if (content)
            contents.push(content);
    }

    return contents;
};

export * from './content';
