import { getUser } from '@/app/utils';
import { ArticlePageParamsProps } from '@/interfaces/page';
import {
    createGuildWebPageContent,
    getGuildWebPage,
    getGuildWebPageContentsByPageId,
    hasDashboardAccess
} from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { CreateGuildWebPageContentSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import deepmerge from 'lodash/merge';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: Request, props: ArticlePageParamsProps) => {
    const { id, slug } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const page = await getGuildWebPage(slug);
    if (!page || page.guildId !== id)
        return NextResponse.json({ message: 'Page not found!' }, { status: 404 });

    return NextResponse.json(await getGuildWebPageContentsByPageId(page.id), { status: 200 });
};

export const POST = async (req: NextRequest, props: ArticlePageParamsProps) => {
    const { id, slug } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const page = await getGuildWebPage(slug);
    if (!page || page.guildId !== id)
        return NextResponse.json({ message: 'Page not found!' }, { status: 404 });

    const body = await req.json();
    const result = CreateGuildWebPageContentSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const data: Parameters<typeof createGuildWebPageContent>[1] = deepmerge(
        result.data,
        {
            user: user.id
        }
    );

    try {
        return NextResponse.json(await createGuildWebPageContent(page.id, data), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
