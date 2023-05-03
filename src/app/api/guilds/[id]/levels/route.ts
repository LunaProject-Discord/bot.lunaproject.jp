import { getGuildById, hasPermission } from '@lunaproject-discord/web-discord';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { PartialGuildLevel } from '../../../../../interfaces/bot';
import { WithIdParamProps } from '../../../../../interfaces/page';
import { getGuildLevels, getGuildSettings } from '../../../../../libs/bot';
import prisma from '../../../../../libs/prisma';
import { COOKIE_TOKEN } from '../../../../../utils/cookie';

export const GET = async (req: NextRequest, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const isFetchUser = Boolean(req.nextUrl.searchParams.get('fetch_user'));

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const guildSettings = await getGuildSettings(id);
    if (!hasPermission(guild) || !guildSettings?.level.leaderboard.public)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    return NextResponse.json(await getGuildLevels(id, isFetchUser), { status: 200 });
};

export const PATCH = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const guildSettings = await getGuildSettings(id);
    if (!hasPermission(guild) || !guildSettings?.level.leaderboard.public)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const data: PartialGuildLevel[] = await req.json();

    const counts = await prisma.$transaction(data.map((level) => prisma.$executeRaw`
        UPDATE \`guilds_levels\`
        SET \`level\` = ${level.level},
            \`xp\`    = ${level.xp}
        WHERE \`guild_id\` = ${BigInt(id)}
          AND \`user_id\` = ${BigInt(level.user_id)}
    `));
    const count = counts.reduce((sum, count) => sum + count, 0);

    return NextResponse.json({ count }, { status: count > 0 ? 200 : 204 });
};
