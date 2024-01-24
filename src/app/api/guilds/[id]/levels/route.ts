import { PartialGuildLevels } from '@interfaces/bot';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildLevels } from '@libs/bot';
import prisma from '@libs/prisma';
import { updateGuildById } from '@libs/redis';
import { getGuildById } from '@lunaproject/web-discord/dist/libs';
import { PartialGuildLevelsSchema } from '@schemas/bot';
import { COOKIE_TOKEN } from '@utils/cookie';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions } from '@utils/discord';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
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

export const PATCH = async (req: NextRequest, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
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

    const levels: PartialGuildLevels = result.data;

    const guildLevels = await prisma.$transaction(levels.map((level) => prisma.guild_levels.update({
        where: {
            guild_id_user_id: {
                guild_id: BigInt(id),
                user_id: BigInt(level.user_id)
            }
        },
        data: {
            level: level.level,
            experience: level.experience
        }
    })));

    await updateGuildById(id);

    return new NextResponse(null, { status: guildLevels.length > 0 ? 200 : 204 });
};
