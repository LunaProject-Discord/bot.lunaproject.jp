import { getUser } from '@/app/utils';
import { TagPageParamsProps } from '@/interfaces/page';
import { deleteGuildWebTag, getGuildWebTag, hasDashboardAccess, updateGuildWebTag } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { UpdateGuildWebTagSchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: Request, props: TagPageParamsProps) => {
    const { id, tagId } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const tag = await getGuildWebTag(tagId);
    if (!tag || tag.guildId !== id)
        return NextResponse.json({ message: 'Tag not found!' }, { status: 404 });

    return NextResponse.json(tag, { status: 200 });
};

export const PATCH = async (req: NextRequest, props: TagPageParamsProps) => {
    const { id, tagId } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const tag = await getGuildWebTag(tagId);
    if (!tag || tag.guildId !== id)
        return NextResponse.json({ message: 'Tag not found!' }, { status: 404 });

    const body = await req.json();
    const result = UpdateGuildWebTagSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const data = result.data;

    try {
        return NextResponse.json(await updateGuildWebTag(tag.id, data), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, props: TagPageParamsProps) => {
    const { id, tagId } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const tag = await getGuildWebTag(tagId);
    if (!tag || tag.guildId !== id)
        return NextResponse.json({ message: 'Tag not found!' }, { status: 404 });

    try {
        await deleteGuildWebTag(tag.id);
        return new NextResponse(null, { status: 204 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
