import { StatisticsPageProps } from '@app/statistics/interfaces';
import { Statistic, StatisticsPeriodData, StatisticsPeriodType } from '@interfaces/bot';
import { format } from '@lunaproject-discord/web-core/dist/utils/date';
import { max } from '@utils/array';
import { fromDBDate } from '@utils/date';
import { endOfWeek, startOfWeek } from 'date-fns';
import { DateTime } from 'luxon';

export const getDate = (statistic: Statistic) => fromDBDate(new Date(statistic.createdAt));

export const formatDate = (date: Date, period: StatisticsPeriodType) => {
    switch (period) {
        case 'hours':
            return format(date, 'y年M月d日 H時');
        case 'days':
            return format(date, 'y年M月d日');
        case 'weeks':
            const start = startOfWeek(date);
            const end = endOfWeek(date);
            return `${format(start, 'M月d日')} ~ ${format(end, 'M月d日')}`;
        case 'months':
            return format(date, 'y年M月');
    }
};

export const getPeriod = ({ searchParams }: StatisticsPageProps): StatisticsPeriodData => {
    const start = searchParams?.start ? DateTime.fromSQL(searchParams.start) : undefined;
    const end = searchParams?.end ? DateTime.fromSQL(searchParams.end) : undefined;

    return {
        type: searchParams?.period ?? 'hours',
        startedAt: start?.isValid ? start : undefined,
        endedAt: end?.isValid ? end : undefined
    };
};

export const getMaxShards = (statistics: Statistic[], predicate: (statistic: Statistic) => Record<number, any>) => max(statistics, (statistic) => Object.keys(predicate(statistic)).length)?.guilds.shards ?? {};
