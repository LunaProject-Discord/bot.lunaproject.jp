import { UserConfiguration, UserConfigurationLanguage } from '@interfaces/bot';
import prisma from '@libs/prisma';
import { TimeZone } from '@utils/timezone';

export const getUserConfiguration = async (id: string): Promise<UserConfiguration | undefined> => {
    const userId = BigInt(id);
    const userData = await prisma.users.findUnique({
        where: {
            id: userId
        }
    });
    const userConfigurationData = await prisma.users_configurations.findUnique({
        where: {
            id: userId
        }
    });

    if (!userData || !userConfigurationData)
        return undefined;

    return {
        id,
        language: userConfigurationData.language as UserConfigurationLanguage,
        timezone: userConfigurationData.timezone as TimeZone
    };
};
