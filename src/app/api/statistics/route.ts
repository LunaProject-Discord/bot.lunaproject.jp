import { getUser } from '@app/utils';
import { StatisticsPeriodType } from '@interfaces/bot';
import { getPeriodStatistics, getUserFlags } from '@libs/bot';
import { DateTime } from 'luxon';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const user = await getUser();
    const userFlags = user ? await getUserFlags(user.id) : undefined;
    if (!user || !userFlags || !userFlags.manager)
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') as StatisticsPeriodType | undefined ?? 'hours';
    const start = searchParams.has('start') ? DateTime.fromSQL(searchParams.get('start')!!) : undefined;
    const end = searchParams.has('end') ? DateTime.fromSQL(searchParams.get('end')!!) : undefined;

    const statistics = await getPeriodStatistics(period, { start, end });
    if (!statistics)
        return new NextResponse(null, { status: 204 });

    return NextResponse.json(statistics, { status: 200 });
};
