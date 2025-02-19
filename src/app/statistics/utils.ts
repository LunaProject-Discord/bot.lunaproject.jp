import { StatisticsPageProps } from '@/app/statistics/interfaces';
import { Statistic, StatisticsPeriodData, StatisticsPeriodType } from '@/interfaces/bot';
import { Localization } from '@/interfaces/localization';
import { max } from '@lunaproject/web-core/dist/utils';
import { DateTime } from 'luxon';

export const getDate = (statistic: Statistic) => {
    const dateTime = DateTime.fromMillis(statistic.createdAt, { zone: 'Asia/Tokyo' });
    return dateTime.isValid ? dateTime : DateTime.local({ zone: 'Asia/Tokyo' });
};

export const formatDate = (
    dateTime: DateTime<true>,
    period: StatisticsPeriodType,
    {
        locale,
        translations
    }: Localization
) => {
    const localizedDateTime = dateTime.setLocale(locale);

    const pattern = translations.pattern_date_luxon as string;

    switch (period) {
        case 'hours':
            return localizedDateTime.toFormat(locale === 'ja' ? `${pattern} H時` : `${pattern} h a`);
        case 'days':
            return localizedDateTime.toFormat(pattern);
        case 'weeks':
            const start = localizedDateTime.startOf('week', { useLocaleWeeks: true });
            const end = localizedDateTime.endOf('week', { useLocaleWeeks: true });
            return `${start.toFormat(pattern)} ~ ${end.toFormat(pattern)}`;
        case 'months':
            return localizedDateTime.toFormat(locale === 'ja' ? 'yyyy年M月' : 'MMMM yyyy');
    }
};

export const getPeriod = async (props: StatisticsPageProps): Promise<StatisticsPeriodData> => {
    const searchParams = await props.searchParams;
    const start = searchParams?.start ? DateTime.fromSQL(searchParams.start) : undefined;
    const end = searchParams?.end ? DateTime.fromSQL(searchParams.end) : undefined;

    return {
        type: searchParams?.period ?? 'hours',
        startedAt: start?.isValid ? start : undefined,
        endedAt: end?.isValid ? end : undefined
    };
};

export const getMaxShards = (statistics: Statistic[], predicate: (statistic: Statistic) => Record<number, any>) => max(statistics, (statistic) => Object.keys(predicate(statistic)).length)?.guilds.shards ?? {};
