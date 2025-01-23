import { database, Users } from '@/database';
import { UserFlags, UserPermission } from '@/interfaces/bot';
import { eq } from 'drizzle-orm';

export const getUserPermission = async (id: string): Promise<UserPermission> => {
    const user = await database.query.Users.findFirst({
        where: eq(Users.id, BigInt(id)),
        columns: {
            permission: true
        }
    });
    if (!user)
        return 'default';

    switch (user.permission) {
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
    const user = await database.query.Users.findFirst({
        where: eq(Users.id, BigInt(id)),
        columns: {
            permission: true,
            flags: true
        }
    });
    if (!user)
        return undefined;

    const flags = user.flags;
    return {
        id,
        manager: (user?.permission ?? 0) > 0,
        verified: flags.verified,
        partner: flags.partner,
        tester: flags.tester,
        bugHunter: flags.bug_hunter
    };
};

export * from './configuration';
export * from './notification';
