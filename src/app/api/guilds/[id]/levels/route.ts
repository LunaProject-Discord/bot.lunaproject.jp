import { database, Guild_Levels } from '@/database';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildLevels } from '@/libs/bot';
import { updateGuildById } from '@/libs/redis';
import { PartialGuildLevelsSchema } from '@/schemas/bot';
import { COOKIE_TOKEN } from '@/utils/cookie';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions } from '@/utils/discord';
import { getGuildById } from '@lunaproject/web-discord/dist/libs';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, props: GenericPageParamsProps) => {
    const { id } = await props.params;

    const nextCookies = await cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const isFetchUser = Boolean(req.nextUrl.searchParams.get('fetch_user'));

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    if (!someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    return NextResponse.json(await getGuildLevels(id), { status: 200 });
};

export const PATCH = async (req: NextRequest, props: GenericPageParamsProps) => {
    const { id } = await props.params;

    const nextCookies = await cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    if (!someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const body = await req.json();
    const result = PartialGuildLevelsSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const levels = result.data;

    await database.transaction(async (transaction) => {
        for (const { user_id, level, experience } of levels) {
            await transaction
                .update(Guild_Levels)
                .set({
                    level: level,
                    experience: experience
                })
                .where(
                    and(
                        eq(Guild_Levels.guildId, BigInt(id)),
                        eq(Guild_Levels.userId, BigInt(user_id))
                    )
                );
        }
    });

    await updateGuildById(id);

    return new NextResponse(null, { status: 204 });
};
