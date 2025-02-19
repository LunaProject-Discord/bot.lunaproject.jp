import { getUser } from '@/app/utils';
import { CategoryPageParamsProps } from '@/interfaces/page';
import { deleteGuildWebCategory, getGuildWebCategory, hasDashboardAccess, updateGuildWebCategory } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { UpdateGuildWebCategorySchema } from '@/schemas/bot';
import { errorWithName } from '@lunaproject/web-core/dist/utils';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: Request, props: CategoryPageParamsProps) => {
    const { id, categoryId } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const category = await getGuildWebCategory(categoryId);
    if (!category || category.guildId !== id)
        return NextResponse.json({ message: 'Category not found!' }, { status: 404 });

    return NextResponse.json(category, { status: 200 });
};

export const PATCH = async (req: NextRequest, props: CategoryPageParamsProps) => {
    const { id, categoryId } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const category = await getGuildWebCategory(categoryId);
    if (!category || category.guildId !== id)
        return NextResponse.json({ message: 'Category not found!' }, { status: 404 });

    const body = await req.json();
    const result = UpdateGuildWebCategorySchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const data = result.data;

    try {
        return NextResponse.json(await updateGuildWebCategory(category.id, data), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, props: CategoryPageParamsProps) => {
    const { id, categoryId } = await props.params;

    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const category = await getGuildWebCategory(categoryId);
    if (!category || category.guildId !== id)
        return NextResponse.json({ message: 'Category not found!' }, { status: 404 });

    try {
        await deleteGuildWebCategory(category.id);
        return new NextResponse(null, { status: 204 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
