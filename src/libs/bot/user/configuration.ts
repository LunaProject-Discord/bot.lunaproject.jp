import { ConfigurationLanguage, UserConfiguration } from '@interfaces/bot';
import prisma from '@libs/prisma';
import { TimeZone } from '@utils/timezone';

export const getUserConfiguration = async (id: string): Promise<UserConfiguration | undefined> => {
    const userConfigurationData = await prisma.users_configurations.findUnique({ where: { id: BigInt(id) } });
    if (!userConfigurationData)
        return undefined;

    return {
        id,
        language: userConfigurationData.language as ConfigurationLanguage,
        timezone: userConfigurationData.timezone as TimeZone
    };
};
