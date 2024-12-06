import { getUser } from '@/app/utils';
import { WithIdParamProps } from '@/interfaces/page';
import { deleteGuildWebPage, getGuildWebPage, hasDashboardAccess, updateGuildWebPage } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { UpdateGuildWebPageSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import { NextRequest, NextResponse } from 'next/server';

type RouteProps = WithIdParamProps & {
    params: {
        pageId: string;
    }
}

export const GET = async (req: Request, { params: { id, pageId } }: RouteProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const page = await getGuildWebPage(pageId);
    if (!page || page.guildId !== id)
        return NextResponse.json({ message: 'Page not found!' }, { status: 404 });

    return NextResponse.json(page, { status: 200 });
};

export const PATCH = async (req: NextRequest, { params: { id, pageId } }: RouteProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const page = await getGuildWebPage(pageId);
    if (!page || page.guildId !== id)
        return NextResponse.json({ message: 'Page not found!' }, { status: 404 });

    const body = await req.json();
    const result = UpdateGuildWebPageSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const data = result.data;

    try {
        return NextResponse.json(await updateGuildWebPage(page.id, data), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params: { id, pageId } }: RouteProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const page = await getGuildWebPage(pageId);
    if (!page || page.guildId !== id)
        return NextResponse.json({ message: 'Page not found!' }, { status: 404 });

    try {
        await deleteGuildWebPage(page.id);
        return new NextResponse(null, { status: 204 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
