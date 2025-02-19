import { Statistics, StatisticsPeriodType } from '@/interfaces/bot';

export interface StatisticsPageProps {
    searchParams?: Promise<{
        period?: StatisticsPeriodType;
        start?: string;
        end?: string;
    }>;
}

export interface StatisticsViewProps {
    statistics: Statistics;
}
