import { UserFlags } from '@interfaces/bot';
import prisma from '@libs/prisma';

export const getUserFlags = async (id: string): Promise<UserFlags | undefined> => {
    const userData = await prisma.users.findUnique({ where: { id: BigInt(id) } });
    if (!userData)
        return undefined;

    const flags = userData ? JSON.parse(userData.flags) : {};
    return {
        id,
        manager: (userData?.permission ?? 0) > 0,
        verified: flags.verified,
        partner: flags.partner,
        tester: flags.tester,
        bugHunter: flags.bug_hunter
    };
};

export * from './configuration';
export * from './notification';
