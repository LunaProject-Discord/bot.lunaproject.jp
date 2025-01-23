import { database, Guild_Web_Pages } from '@/database';
import { GuildWebPage } from '@/interfaces/bot';
import { getGuildWebPage } from '@/libs/bot';
import { eq } from 'drizzle-orm';

export const getGuildWebPagesByGuildId = async (guildId: string): Promise<GuildWebPage[]> => {
    const guildWebPages = await database.query.Guild_Web_Pages.findMany({
        where: eq(Guild_Web_Pages.guildId, BigInt(guildId))
    });

    const pages: GuildWebPage[] = [];
    for (const guildWebPage of guildWebPages) {
        const page = await getGuildWebPage(guildWebPage);
        if (page)
            pages.push(page);
    }

    return pages;
};

export * from './page';
