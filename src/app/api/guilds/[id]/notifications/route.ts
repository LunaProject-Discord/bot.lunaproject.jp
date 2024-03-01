import { WithIdParamProps } from '@/interfaces/page';
import { getGuildNotifications } from '@/libs/bot';
import { COOKIE_TOKEN } from '@/utils/cookie';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions } from '@/utils/discord';
import { getGuildById } from '@lunaproject/web-discord/dist/libs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    if (!someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    return NextResponse.json(await getGuildNotifications(id), { status: 200 });
};
