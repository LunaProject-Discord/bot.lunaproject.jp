import { WithIdParamProps } from '@interfaces/page';
import { getGuildById } from '@lunaproject-discord/web-discord';
import { COOKIE_TOKEN } from '@utils/cookie';
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

    return NextResponse.json(guild, { status: 200 });
};
