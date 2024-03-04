import { StatisticsPageProps } from '@/app/statistics/interfaces';
import { Statistic, StatisticsPeriodData, StatisticsPeriodType } from '@/interfaces/bot';
import { Localization } from '@/interfaces/localization';
import { getDateFnsLocaleByName } from '@/localizations';
import { max } from '@/utils/array';
import { fromDBDate } from '@/utils/date';
import { format } from '@lunaproject/web-core/dist/utils/date';
import { endOfWeek, format as formatDateFns, startOfWeek } from 'date-fns';
import { DateTime } from 'luxon';

export const getDate = (statistic: Statistic) => fromDBDate(new Date(statistic.createdAt));

export const formatDate = (date: Date, period: StatisticsPeriodType, { locale, translations }: Localization) => {
    const pattern = translations.pattern_date as string;
    const options: Parameters<typeof formatDateFns>[2] = { locale: getDateFnsLocaleByName(locale) };

    switch (period) {
        case 'hours':
            return format(date, locale === 'ja' ? `${pattern} H時` : `${pattern} h a`, options);
        case 'days':
            return format(date, pattern, options);
        case 'weeks':
            const start = startOfWeek(date);
            const end = endOfWeek(date);
            return `${format(start, pattern, options)} ~ ${format(end, pattern, options)}`;
        case 'months':
            return format(date, locale === 'ja' ? 'yyyy年M月' : 'MMMM yyyy', options);
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
