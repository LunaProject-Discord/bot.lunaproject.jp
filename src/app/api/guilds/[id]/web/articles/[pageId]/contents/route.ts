import { getUser } from '@/app/utils';
import { WithIdParamProps } from '@/interfaces/page';
import { createGuildWebPageContent, getGuildWebPage, getGuildWebPageContents, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { CreateGuildWebPageContentSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import deepmerge from 'deepmerge';
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

    return NextResponse.json(await getGuildWebPageContents(page.id), { status: 200 });
};

export const POST = async (req: NextRequest, { params: { id, pageId } }: RouteProps) => {
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
    const result = CreateGuildWebPageContentSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const data: Parameters<typeof createGuildWebPageContent>[1] = deepmerge(
        result.data,
        {
            userId: user.id
        }
    );

    try {
        return NextResponse.json(await createGuildWebPageContent(page.id, data), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
