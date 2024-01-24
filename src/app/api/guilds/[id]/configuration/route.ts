import { getUser } from '@app/utils';
import { GuildConfiguration } from '@interfaces/bot';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration, hasDashboardAccess } from '@libs/bot';
import prisma from '@libs/prisma';
import { getGuildById, updateGuildById } from '@libs/redis';
import { errorWithName } from '@lunaproject/web-core/dist/utils/logger';
import { Prisma } from '@prisma/client';
import { PartialGuildConfigurationSchema } from '@schemas/bot';
import { addHours } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

type valueOf<T> = T[keyof T];

export const GET = async (req: Request, { params: { id } }: WithIdParamProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    return NextResponse.json(await getGuildConfiguration(id), { status: 200 });
};

export const PATCH = async (req: NextRequest, { params: { id } }: WithIdParamProps) => {
    const user = await getUser();
    if (!user)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const guild = await getGuildById(id);
    if (!guild)
        return NextResponse.json({ message: 'Guild not found!' }, { status: 404 });

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return NextResponse.json({ message: 'Permission denied!' }, { status: 403 });

    const body = await req.json();
    const result = PartialGuildConfigurationSchema.safeParse(body);
    if (!result.success)
        return NextResponse.json({ message: 'Invalid body!', issues: result.error.issues }, { status: 400 });

    const configuration = result.data;

    try {
        const guildId = BigInt(id);
        const now = addHours(new Date(), 9);

        if (Object.keys(configuration).length > 0) {
            const inputs: {
                [key: string]: valueOf<Prisma.XOR<Prisma.guild_configurationsUpdateInput, Prisma.guild_configurationsUncheckedUpdateInput>>
            } = {};

            const configurationSections: { [key: string]: valueOf<GuildConfiguration> } = configuration;
            for (const sectionKey in configurationSections) {
                const value = configurationSections[sectionKey];
                inputs[sectionKey] = typeof value === 'object' ? JSON.stringify(value) : value;
            }

            await prisma.guild_configurations.update({
                where: {
                    guild_id: guildId
                },
                data: {
                    ...inputs,
                    updated_at: now
                }
            });
        }

        await updateGuildById(id);

        return NextResponse.json(await getGuildConfiguration(id), { status: 200 });
    } catch (e) {
        errorWithName(`(${req.method.toUpperCase()})${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`, e);
        return NextResponse.json({ message: 'Internal server error!' }, { status: 500 });
    }
};
