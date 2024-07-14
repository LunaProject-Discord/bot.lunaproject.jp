import { Statistic, StatisticChannelsData, Statistics, StatisticsPeriodType } from '@/interfaces/bot';
import prisma from '@/libs/prisma';
import { toDBDate } from '@/utils/date';
import { system_statistics } from '@prisma/client';
import { endOfWeek } from 'date-fns/endOfWeek';
import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { DateObjectUnits, DateTime, Settings } from 'luxon';

export const getStatistic = async (statisticOrId: system_statistics | number): Promise<Statistic | undefined> => {
    const systemStatistic = typeof statisticOrId === 'number' ? await prisma.system_statistics.findUnique({ where: { id: statisticOrId } }) : statisticOrId;
    if (!systemStatistic)
        return undefined;

    const channels = JSON.parse(systemStatistic.channels);
    const channelsShards = channels.shards as Record<number, any>;

    const channelsShardsRecord: Record<number, StatisticChannelsData> = {};
    for (const [key, value] of Object.entries(channelsShards)) {
        channelsShardsRecord[Number(key)] = {
            total: value.total,
            categories: value.categories,
            textChannels: value.text_channels,
            voiceChannels: value.voice_channels,
            announcementChannels: value.announcement_channels,
            stageChannels: value.stage_channels,
            forumChannels: value.forum_channels,
            threads: value.threads
        };
    }

    return {
        id: systemStatistic.id,
        statuses: JSON.parse(systemStatistic.statuses),
        pings: JSON.parse(systemStatistic.pings),
        guilds: JSON.parse(systemStatistic.guilds),
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
        roles: JSON.parse(systemStatistic.roles),
        emojis: JSON.parse(systemStatistic.emojis),
        users: JSON.parse(systemStatistic.users),
        updatedAt: systemStatistic.updated_at.getTime(),
        createdAt: systemStatistic.created_at.getTime()
    };
};

export const getLatestStatistic = async (): Promise<Statistic | undefined> => {
    const systemStatistic = await prisma.system_statistics.findFirst({ orderBy: { created_at: 'desc' } });
    if (!systemStatistic)
        return undefined;

    return getStatistic(systemStatistic);
};

export const getStatistics = async (): Promise<Statistic[]> => {
    const systemStatistics = await prisma.system_statistics.findMany();
    if (!systemStatistics)
        return [];

    const lists: Statistic[] = [];
    for (const systemStatistic of systemStatistics) {
        const list = await getStatistic(systemStatistic);
        if (list)
            lists.push(list);
    }

    return lists;
};

export interface DatePeriod {
    start?: DateTime;
    end?: DateTime;
}

export const getHoursStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ day: 1, hour: 1 });
    const end = period?.end ?? DateTime.now().minus({ hour: 1 });

    const systemStatistics = await prisma.system_statistics_hours.findMany({
        where: {
            created_at: {
                gte: toDBDate(setHoursDateTime(start, 'start').toJSDate()),
                lte: toDBDate(setHoursDateTime(end, 'end').toJSDate())
            }
        }
    });
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const lists: Statistic[] = [];
    for (const systemStatistic of systemStatistics) {
        const list = await getStatistic(systemStatistic);
        if (list)
            lists.push(list);
    }

    return {
        total: lists.length,
        period: {
            type: 'hours',
            startedAt: setHoursDateTime(DateTime.fromMillis(lists[0].createdAt), 'start').toMillis(),
            endedAt: setHoursDateTime(DateTime.fromMillis(lists[lists.length - 1].createdAt), 'end').toMillis()
        },
        statistics: lists
    };
};

export const getDaysStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ month: 1 });
    const end = period?.end ?? DateTime.now().minus({ day: 1 });

    const systemStatistics = await prisma.system_statistics_days.findMany({
        where: {
            created_at: {
                gte: toDBDate(setDaysDateTime(start, 'start').toJSDate()),
                lte: toDBDate(setDaysDateTime(end, 'end').toJSDate())
            }
        }
    });
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const lists: Statistic[] = [];
    for (const systemStatistic of systemStatistics) {
        const list = await getStatistic(systemStatistic);
        if (list)
            lists.push(list);
    }

    return {
        total: lists.length,
        period: {
            type: 'days',
            startedAt: setDaysDateTime(DateTime.fromMillis(lists[0].createdAt), 'start').toMillis(),
            endedAt: setDaysDateTime(DateTime.fromMillis(lists[lists.length - 1].createdAt), 'end').toMillis()
        },
        statistics: lists
    };
};

export const getWeeksStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ week: 7 });
    const end = period?.end ?? DateTime.now().minus({ week: 1 });

    const systemStatistics = await prisma.system_statistics_weeks.findMany({
        where: {
            created_at: {
                gte: toDBDate(setWeeksDateTime(start, 'start').toJSDate()),
                lte: toDBDate(setWeeksDateTime(end, 'end').toJSDate())
            }
        }
    });
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const lists: Statistic[] = [];
    for (const systemStatistic of systemStatistics) {
        const list = await getStatistic(systemStatistic);
        if (list)
            lists.push(list);
    }

    return {
        total: lists.length,
        period: {
            type: 'weeks',
            startedAt: setWeeksDateTime(DateTime.fromMillis(lists[0].createdAt), 'start').toMillis(),
            endedAt: setWeeksDateTime(DateTime.fromMillis(lists[lists.length - 1].createdAt), 'end').toMillis()
        },
        statistics: lists
    };
};

export const getMonthsStatistics = async (period?: DatePeriod): Promise<Statistics | undefined> => {
    Settings.defaultZone = 'Asia/Tokyo';
    const start = period?.start ?? DateTime.now().minus({ month: 7 });
    const end = period?.end ?? DateTime.now().minus({ month: 1 });

    const systemStatistics = await prisma.system_statistics_months.findMany({
        where: {
            created_at: {
                gte: toDBDate(setMonthsDateTime(start, 'start').toJSDate()),
                lte: toDBDate(setMonthsDateTime(end, 'end').toJSDate())
            }
        }
    });
    if (!systemStatistics || systemStatistics.length < 1)
        return undefined;

    const lists: Statistic[] = [];
    for (const systemStatistic of systemStatistics) {
        const list = await getStatistic(systemStatistic);
        if (list)
            lists.push(list);
    }

    return {
        total: lists.length,
        period: {
            type: 'months',
            startedAt: setMonthsDateTime(DateTime.fromMillis(lists[0].createdAt), 'start').toMillis(),
            endedAt: setMonthsDateTime(DateTime.fromMillis(lists[lists.length - 1].createdAt), 'end').toMillis()
        },
        statistics: lists
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
