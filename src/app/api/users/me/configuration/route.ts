import { getUser } from '@app/utils';
import { UserConfiguration } from '@interfaces/bot';
import { getUserConfiguration } from '@libs/bot';
import prisma from '@libs/prisma';
import { updateUserConfigurationById } from '@libs/redis';
import { errorWithName } from '@lunaproject/web-core/dist/utils/logger';
import { Prisma } from '@prisma/client';
import { addHours } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

type valueOf<T> = T[keyof T];

export const GET = async (req: Request) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    return NextResponse.json(await getUserConfiguration(user.id), { status: 200 });
};

export const PATCH = async (req: NextRequest) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const data: Partial<UserConfiguration> = await req.json();
    delete data.id;

    try {
        const userId = BigInt(user.id);
        const now = addHours(new Date(), 9);

        if (Object.keys(data).length > 0) {
            const inputs: {
                [key: string]: valueOf<Prisma.XOR<Prisma.users_configurationsUpdateInput, Prisma.users_configurationsUncheckedUpdateInput>>
            } = {};

            const configurationSections: { [key: string]: valueOf<UserConfiguration> } = data;
            for (const sectionKey in configurationSections) {
                const value = configurationSections[sectionKey];
                inputs[sectionKey] = typeof value === 'object' ? JSON.stringify(value) : value;
            }

            await prisma.users_configurations.update({
                where: {
                    id: userId
                },
                data: {
                    ...inputs,
                    updated_at: now
                }
            });
        }

        await updateUserConfigurationById(user.id);

        return NextResponse.json(await getUserConfiguration(user.id), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
