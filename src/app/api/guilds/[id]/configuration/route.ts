import { getUser } from '@app/utils';
import { GuildConfiguration } from '@interfaces/bot';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration, hasDashboardAccess } from '@libs/bot';
import prisma from '@libs/prisma';
import { updateGuildConfigurationById } from '@libs/redis';
import { errorWithName } from '@lunaproject/web-core/dist/utils/logger';
import { getGuildById } from '@lunaproject/web-discord/dist/libs';
import { Prisma } from '@prisma/client';
import { addHours } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

type valueOf<T> = T[keyof T];

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

    return NextResponse.json(await getGuildConfiguration(id), { status: 200 });
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

    const data: Partial<GuildConfiguration> = await req.json();
    delete data.id;

    try {
        const guildId = BigInt(id);
        const now = addHours(new Date(), 9);

        if (Object.keys(data).length > 0) {
            const inputs: {
                [key: string]: valueOf<Prisma.XOR<Prisma.guilds_configurationsUpdateInput, Prisma.guilds_configurationsUncheckedUpdateInput>>
            } = {};

            const configurationSections: { [key: string]: valueOf<GuildConfiguration> } = data;
            for (const sectionKey in configurationSections) {
                const value = configurationSections[sectionKey];
                inputs[sectionKey] = typeof value === 'object' ? JSON.stringify(value) : value;
            }

            await prisma.guilds_configurations.update({
                where: {
                    id: guildId
                },
                data: {
                    ...inputs,
                    updated_at: now
                }
            });
        }

        await updateGuildConfigurationById(id);

        return NextResponse.json(await getGuildConfiguration(id), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
