import { getUser } from '@/app/utils';
import { getUserConfiguration, setUserConfiguration } from '@/libs/bot';
import { updateUserById } from '@/libs/redis';
import { PartialUserConfigurationSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import { NextRequest, NextResponse } from 'next/server';

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
        const data = await setUserConfiguration(user.id, configuration);

        await updateUserById(user.id);

        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
