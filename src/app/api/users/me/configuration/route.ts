import { getUser } from '@/app/utils';
import { UserConfiguration } from '@/interfaces/bot';
import { getUserConfiguration } from '@/libs/bot';
import prisma from '@/libs/prisma';
import { updateUserById } from '@/libs/redis';
import { PartialUserConfigurationSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import { Prisma } from '@prisma/client';
import { addHours } from 'date-fns/addHours';
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

    const body = await req.json();
    const result = PartialUserConfigurationSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const configuration = result.data;

    try {
        const userId = BigInt(user.id);
        const now = addHours(new Date(), 9);

        if (Object.keys(configuration).length > 0) {
            const inputs: {
                [key: string]: valueOf<Prisma.XOR<Prisma.user_configurationsUpdateInput, Prisma.user_configurationsUncheckedUpdateInput>>
            } = {};

            const configurationSections: { [key: string]: valueOf<UserConfiguration> } = configuration;
            for (const sectionKey in configurationSections) {
                const value = configurationSections[sectionKey];
                inputs[sectionKey] = typeof value === 'object' ? JSON.stringify(value) : value;
            }

            await prisma.user_configurations.update({
                where: {
                    user_id: userId
                },
                data: {
                    ...inputs,
                    updated_at: now
                }
            });
        }

        await updateUserById(user.id);

        return NextResponse.json(await getUserConfiguration(user.id), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
