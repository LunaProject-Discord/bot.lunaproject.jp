import {
    database,
    System_Statistics,
    System_Statistics_Days,
    System_Statistics_Hours,
    System_Statistics_Months,
    System_Statistics_Weeks
} from '@/database';
import { Statistic, StatisticChannelsData, Statistics, StatisticsPeriodType } from '@/interfaces/bot';
import { fromSQLDate, toSQLDate } from '@/utils/date';
import { endOfWeek } from 'date-fns/endOfWeek';
import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { DateObjectUnits, DateTime, Settings } from 'luxon';

export const getStatistic = async (statisticOrId: typeof System_Statistics.$inferSelect | number): Promise<Statistic | undefined> => {
    const systemStatistic = typeof statisticOrId === 'number' ? await database.query.System_Statistics.findFirst({
        where: eq(System_Statistics.id, statisticOrId)
    }) : statisticOrId;
    if (!systemStatistic)
        return undefined;

    const channels = systemStatistic.channels;
    const channelsShards = channels.shards;

    const channelsShardsRecord: Record<number, StatisticChannelsData> = Object.fromEntries(
        Object.entries(channelsShards).map(([key, value]) => [
            Number(key),
            {
                total: value.total,
                categories: value.categories,
                textChannels: value.text_channels,
                voiceChannels: value.voice_channels,
                announcementChannels: value.announcement_channels,
                stageChannels: value.stage_channels,
                forumChannels: value.forum_channels,
                threads: value.threads
            }
        ])
    );

    return {
        id: systemStatistic.id,
        statuses: systemStatistic.statuses,
        pings: systemStatistic.pings,
        guilds: systemStatistic.guilds,
        channels: {
            total: channels.total,
            categories: channels.categories,
            textChannels: channels.text_channels,
            voiceChannels: channels.voice_channels,
            announcementChannels: channels.announcement_channels,
            stageChannels: channels.stage_channels,
            forumChannels: channels.forum_channels,
            threads: channels.threads,
            shards: channelsShardsRecord
        },
        roles: systemStatistic.roles,
        emojis: systemStatistic.emojis,
        users: systemStatistic.users,
        updatedAt: fromSQLDate(systemStatistic.updatedAt).toMillis(),
        createdAt: fromSQLDate(systemStatistic.createdAt).toMillis()
    };
};

export const getLatestStatistic = async (): Promise<Statistic | undefined> => {
    const systemStatistic = await database.query.System_Statistics.findFirst({
        orderBy: [desc(System_Statistics.createdAt)]
    });
    if (!systemStatistic)
        return undefined;

    return getStatistic(systemStatistic);
};

export const getStatistics = async (): Promise<Statistic[]> => {
    const systemStatistics = await database.query.System_Statistics.findMany();
    if (!systemStatistics)
        return [];

    return (await Promise.all(systemStatistics.map(getStatistic)))
        .filter((statistic) => statistic !== undefined);
};


export interface DatePeriod {
    start?: DateTime;
    end?: DateTime;
}

export const getHoursStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ day: 1, hour: 1 });
    const end = period?.end ?? DateTime.now().minus({ hour: 1 });

    const systemStatistics = await database
        .select()
        .from(System_Statistics_Hours)
        .where(
            and(
                gte(System_Statistics_Hours.createdAt, toSQLDate(setHoursDateTime(start, 'start'))),
                lte(System_Statistics_Hours.createdAt, toSQLDate(setHoursDateTime(end, 'end')))
            )
        );
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const statistics = (await Promise.all(systemStatistics.map(getStatistic)))
        .filter((statistic) => statistic !== undefined);

    return {
        total: statistics.length,
        period: {
            type: 'hours',
            startedAt: setHoursDateTime(DateTime.fromMillis(statistics[0].createdAt), 'start').toMillis(),
            endedAt: setHoursDateTime(DateTime.fromMillis(statistics[statistics.length - 1].createdAt), 'end').toMillis()
        },
        statistics
    };
};

export const getDaysStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ month: 1 });
    const end = period?.end ?? DateTime.now().minus({ day: 1 });

    const systemStatistics = await database
        .select()
        .from(System_Statistics_Days)
        .where(
            and(
                gte(System_Statistics_Days.createdAt, toSQLDate(setDaysDateTime(start, 'start'))),
                lte(System_Statistics_Days.createdAt, toSQLDate(setDaysDateTime(end, 'end')))
            )
        );
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const statistics = (await Promise.all(systemStatistics.map(getStatistic)))
        .filter((statistic) => statistic !== undefined);

    return {
        total: statistics.length,
        period: {
            type: 'days',
            startedAt: setDaysDateTime(DateTime.fromMillis(statistics[0].createdAt), 'start').toMillis(),
            endedAt: setDaysDateTime(DateTime.fromMillis(statistics[statistics.length - 1].createdAt), 'end').toMillis()
        },
        statistics
    };
};

export const getWeeksStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ week: 7 });
    const end = period?.end ?? DateTime.now().minus({ week: 1 });

    const systemStatistics = await database
        .select()
        .from(System_Statistics_Weeks)
        .where(
            and(
                gte(System_Statistics_Weeks.createdAt, toSQLDate(setWeeksDateTime(start, 'start'))),
                lte(System_Statistics_Weeks.createdAt, toSQLDate(setWeeksDateTime(end, 'end')))
            )
        );
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const statistics = (await Promise.all(systemStatistics.map(getStatistic)))
        .filter((statistic) => statistic !== undefined);

    return {
        total: statistics.length,
        period: {
            type: 'weeks',
            startedAt: setWeeksDateTime(DateTime.fromMillis(statistics[0].createdAt), 'start').toMillis(),
            endedAt: setWeeksDateTime(DateTime.fromMillis(statistics[statistics.length - 1].createdAt), 'end').toMillis()
        },
        statistics
    };
};

export const getMonthsStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ month: 7 });
    const end = period?.end ?? DateTime.now().minus({ month: 1 });

    const systemStatistics = await database
        .select()
        .from(System_Statistics_Months)
        .where(
            and(
                gte(System_Statistics_Months.createdAt, toSQLDate(setMonthsDateTime(start, 'start'))),
                lte(System_Statistics_Months.createdAt, toSQLDate(setMonthsDateTime(end, 'end')))
            )
        );
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const statistics = (await Promise.all(systemStatistics.map(getStatistic)))
        .filter((statistic) => statistic !== undefined);

    return {
        total: statistics.length,
        period: {
            type: 'months',
            startedAt: setMonthsDateTime(DateTime.fromMillis(statistics[0].createdAt), 'start').toMillis(),
            endedAt: setMonthsDateTime(DateTime.fromMillis(statistics[statistics.length - 1].createdAt), 'end').toMillis()
        },
        statistics
    };
};

export const getPeriodStatistics = async (type: StatisticsPeriodType, period?: DatePeriod): Promise<Statistics | undefined> => {
    switch (type) {
        case 'hours':
            return getHoursStatistics(period);
        case 'days':
            return getDaysStatistics(period);
        case 'weeks':
            return getWeeksStatistics(period);
        case 'months':
            return getMonthsStatistics(period);
    }
};


export type PeriodType = 'start' | 'end';

export const setDateTime = (date: DateTime, type: PeriodType, units: DateObjectUnits = {}) => date.set(
    {
        minute: type === 'start' ? 0 : 59,
        second: type === 'start' ? 0 : 59,
        millisecond: type === 'start' ? 0 : 999,
        ...units
    }
);

export const setHoursDateTime = (date: DateTime, type: PeriodType, units: DateObjectUnits = {}) => setDateTime(date, type, units);

export const setDaysDateTime = (date: DateTime, type: PeriodType, units: DateObjectUnits = {}) => setDateTime(
    date,
    type,
    {
        hour: type === 'start' ? 0 : 23,
        ...units
    }
);

export const setWeeksDateTime = (date: DateTime, type: PeriodType, units: DateObjectUnits = {}) => {
    const weekDate = type === 'start' ? startOfWeek(date.toJSDate()) : endOfWeek(date.toJSDate());
    return setDaysDateTime(
        date,
        type,
        {
            year: weekDate.getFullYear(),
            month: weekDate.getMonth() + 1,
            day: weekDate.getDate(),
            ...units
        }
    );
};

export const setMonthsDateTime = (date: DateTime, type: PeriodType, units: DateObjectUnits = {}) => setDaysDateTime(
    date,
    type,
    {
        day: type === 'start' ? 1 : getDaysInMonth(date.toJSDate()),
        ...units
    }
);
