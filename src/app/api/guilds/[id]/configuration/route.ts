import { getUser } from '@/app/utils';
import { WithIdParamProps } from '@/interfaces/page';
import { getGuildConfiguration, hasDashboardAccess, setGuildConfiguration } from '@/libs/bot';
import { getGuildById, updateGuildById } from '@/libs/redis';
import { PartialGuildConfigurationSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    return NextResponse.json(await getGuildConfiguration(id), { status: 200 });
};

export const PATCH = async (req: NextRequest, { params: { id } }: WithIdParamProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const body = await req.json();
    const result = PartialGuildConfigurationSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const configuration = result.data;

    try {
        const data = await setGuildConfiguration(id, configuration);

        await updateGuildById(id);

        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
