import { GuildConfiguration, GuildConfigurationLanguage } from '@interfaces/bot';
import prisma from '@libs/prisma';
import { TimeZone } from '@utils/timezone';

export const getGuildConfiguration = async (id: string): Promise<GuildConfiguration | undefined> => {
    const guildConfigurationData = await prisma.guilds_configurations.findUnique({ where: { id: BigInt(id) } });
    if (!guildConfigurationData)
        return undefined;

    return {
        id,
        prefix: guildConfigurationData.prefix,
        nickname: guildConfigurationData.nickname,
        language: guildConfigurationData.language as GuildConfigurationLanguage,
        timezone: guildConfigurationData.timezone as TimeZone,
        commands: JSON.parse(guildConfigurationData.commands),
        welcome: JSON.parse(guildConfigurationData.welcome),
        welcome_v2: JSON.parse(guildConfigurationData.welcome_v2),
        goodbye: JSON.parse(guildConfigurationData.goodbye),
        activity: JSON.parse(guildConfigurationData.activity),
        global_chat: JSON.parse(guildConfigurationData.global_chat),
        global_ban: JSON.parse(guildConfigurationData.global_ban),
        level: JSON.parse(guildConfigurationData.level),
        translate: JSON.parse(guildConfigurationData.translate),
        vote: JSON.parse(guildConfigurationData.vote),
        quote: JSON.parse(guildConfigurationData.quote),
        music: JSON.parse(guildConfigurationData.music),
        logging: JSON.parse(guildConfigurationData.logging)
    };
};
