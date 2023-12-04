import { UserFlags, UserPermission } from '@interfaces/bot';
import prisma from '@libs/prisma';

export const getUserPermission = async (id: string): Promise<UserPermission> => {
    const userData = await prisma.users.findUnique({
        where: {
            id: BigInt(id)
        },
        select: {
            permission: true
        }
    });
    if (!userData)
        return 'default';

    switch (userData.permission) {
        case 4:
            return 'owner';
        case 3:
            return 'sub_owner';
        case 2:
            return 'admin';
        case 1:
            return 'staff';
        default:
            return 'default';
    }
};

export const getUserFlags = async (id: string): Promise<UserFlags | undefined> => {
    const userData = await prisma.users.findUnique({
        where: {
            id: BigInt(id)
        },
        select: {
            permission: true,
            flags: true
        }
    });
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
