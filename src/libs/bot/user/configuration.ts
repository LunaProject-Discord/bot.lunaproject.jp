import { database, User_Configurations } from '@/database';
import { ConfigurationLanguage, PartialUserConfiguration, UserConfiguration } from '@/interfaces/bot';
import { TimeZone } from '@/utils/timezone';
import { eq } from 'drizzle-orm';

export const getUserConfiguration = async (id: string): Promise<UserConfiguration | undefined> => {
    const userConfiguration = await database.query.User_Configurations.findFirst({
        where: eq(User_Configurations.userId, BigInt(id))
    });
    if (!userConfiguration)
        return undefined;

    return {
        id,
        language: userConfiguration.language as ConfigurationLanguage,
        timezone: userConfiguration.timezone as TimeZone,
        translate: userConfiguration.translate
    };
};

export const setUserConfiguration = async (id: string, data: PartialUserConfiguration): Promise<UserConfiguration> => {
    const configuration: Partial<Omit<typeof User_Configurations.$inferInsert, 'userId'>> = {
        ...data
    };

    await database
        .update(User_Configurations)
        .set(configuration)
        .where(eq(User_Configurations.userId, BigInt(id)));

    return (await getUserConfiguration(id))!;
};
