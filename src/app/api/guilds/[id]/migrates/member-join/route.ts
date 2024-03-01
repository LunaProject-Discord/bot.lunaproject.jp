import { WithIdParamProps } from '@/interfaces/page';
import { getGuildConfiguration } from '@/libs/bot';
import prisma from '@/libs/prisma';
import { updateGuildById } from '@/libs/redis';
import { COOKIE_TOKEN } from '@/utils/cookie';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions } from '@/utils/discord';
import { getGuildById } from '@lunaproject/web-discord/dist/libs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    if (!someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const guildConfiguration = await getGuildConfiguration(id);
    if (!guildConfiguration)
        return NextResponse.json({ message: 'Guild configuration not found!' }, { status: 404 });

    guildConfiguration.member_join._migrated = true;

    await prisma.guild_configurations.update({
        where: {
            guild_id: BigInt(id)
        },
        data: {
            member_join: JSON.stringify(guildConfiguration.member_join),
            updated_at: new Date()
        }
    });

    await updateGuildById(id);

    return new NextResponse(null, { status: 204 });
};

export const PATCH = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    if (!someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BOT_REST_API_ORIGIN}/v3/guilds/${id}/migrates/member-join`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOT_REST_API_TOKEN}`
            }
        }
    );

    if (!res.ok)
        return NextResponse.json({ message: 'Failed to migrate guild configuration!' }, { status: 500 });

    return new NextResponse(null, { status: 204 });
};
