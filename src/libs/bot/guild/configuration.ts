import { database, Guild_Configurations } from '@/database';
import { ConfigurationLanguage, GuildConfiguration, PartialGuildConfiguration } from '@/interfaces/bot';
import { TimeZone } from '@/utils/timezone';
import { eq } from 'drizzle-orm';

export const getGuildConfiguration = async (id: string): Promise<GuildConfiguration | undefined> => {
    const guildConfiguration = await database.query.Guild_Configurations.findFirst({
        where: eq(Guild_Configurations.guildId, BigInt(id))
    });
    if (!guildConfiguration)
        return undefined;

    return {
        id,
        prefix: guildConfiguration.prefix,
        nickname: guildConfiguration.nickname,
        language: guildConfiguration.language as ConfigurationLanguage,
        timezone: guildConfiguration.timezone as TimeZone,
        commands: guildConfiguration.commands,
        member_join: guildConfiguration.memberJoin,
        goodbye: guildConfiguration.goodbye,
        activity: guildConfiguration.activity,
        global_chat: guildConfiguration.globalChat,
        global_ban: guildConfiguration.globalBan,
        level: guildConfiguration.level,
        translate: guildConfiguration.translate,
        vote: guildConfiguration.vote,
        quote: guildConfiguration.quote,
        music: guildConfiguration.music,
        logging: guildConfiguration.logging
    };
};

export const setGuildConfiguration = async (
    id: string,
    {
        member_join,
        global_chat,
        global_ban,
        ...data
    }: PartialGuildConfiguration
): Promise<GuildConfiguration> => {
    const configuration: Partial<Omit<typeof Guild_Configurations.$inferInsert, 'guildId'>> = {
        ...data,
        memberJoin: member_join,
        globalChat: global_chat,
        globalBan: global_ban
    };

    await database
        .update(Guild_Configurations)
        .set(configuration)
        .where(eq(Guild_Configurations.guildId, BigInt(id)));

    return (await getGuildConfiguration(id))!;
};
