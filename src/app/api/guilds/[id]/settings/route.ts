import { errorWithName } from '@lunaproject-discord/web-core/dist/utils/logger';
import { getGuildById } from '@lunaproject-discord/web-discord/dist/libs';
import { hasPermission } from '@lunaproject-discord/web-discord/dist/utils';
import { Prisma } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GuildSettings } from '../../../../../interfaces/bot';
import { WithIdParamProps } from '../../../../../interfaces/page';
import { getGuildSettings } from '../../../../../libs/bot';
import prisma from '../../../../../libs/prisma';
import { updateGuildSettingsById } from '../../../../../libs/redis';
import { COOKIE_TOKEN } from '../../../../../utils/cookie';

type valueOf<T> = T[keyof T];

export const GET = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    if (!hasPermission(guild))
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    return NextResponse.json(await getGuildSettings(id), { status: 200 });
};

export const PATCH = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const nextCookies = cookies();
    const token = nextCookies.get(COOKIE_TOKEN)?.value;
    if (!token)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id, token);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    if (!hasPermission(guild))
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const data: Partial<GuildSettings> = await req.json();
    delete data.id;

    try {
        const guildId = BigInt(id);
        const now = new Date();

        await prisma.$transaction(async (prisma) => {
            if (data.prefix) {
                await prisma.guilds.update({
                    where: {
                        id: guildId
                    },
                    data: {
                        prefix: data.prefix,
                        updated_at: now
                    }
                });
                delete data.prefix;
            }

            if (Object.keys(data).length > 0) {
                const inputs: {
                    [key: string]: valueOf<Prisma.XOR<Prisma.guilds_settingsUpdateInput, Prisma.guilds_settingsUncheckedUpdateInput>>
                } = {};

                const settings: { [key: string]: valueOf<GuildSettings> } = data;
                for (const key in settings) {
                    const value = settings[key];
                    inputs[key] = typeof value === 'object' ? JSON.stringify(value) : value;
                }

                await prisma.guilds_settings.update({
                    where: {
                        id: guildId
                    },
                    data: {
                        ...inputs,
                        updated_at: now
                    }
                });
            }
        });

        await updateGuildSettingsById(id);

        return NextResponse.json(await getGuildSettings(id), { status: 200 });
    } catch (e) {
        errorWithName(`(PATCH)/api/guilds/${id}/settings`, e);
        console.error(e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
