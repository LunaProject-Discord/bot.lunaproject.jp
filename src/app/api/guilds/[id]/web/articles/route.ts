import { getUser } from '@/app/utils';
import { WithIdParamProps } from '@/interfaces/page';
import { createGuildWebPage, getGuildWebPagesByGuildId, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { CreateGuildWebPageSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import deepmerge from 'deepmerge';
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

    return NextResponse.json(await getGuildWebPagesByGuildId(id), { status: 200 });
};

export const POST = async (req: NextRequest, { params: { id } }: WithIdParamProps) => {
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
    const result = CreateGuildWebPageSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const data: Parameters<typeof createGuildWebPage>[1] = deepmerge(
        result.data,
        result.data.content ? {
            content: {
                user: user.id
            }
        } : {}
    );

    try {
        return NextResponse.json(await createGuildWebPage(id, data), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
