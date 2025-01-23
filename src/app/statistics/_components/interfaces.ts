import { Statistic } from '@/interfaces/bot';
import { DateTime } from 'luxon';

export interface StatisticResponseProps {
    getDate: (statistic: Statistic) => DateTime<true>;
    getValue: (statistic: Statistic) => number;
    formatDate: (date: DateTime<true>) => string;
    formatValue: (value: number) => string;
}
