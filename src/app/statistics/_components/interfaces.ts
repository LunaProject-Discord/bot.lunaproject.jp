import { Statistic } from '@/interfaces/bot';

export interface StatisticResponseProps {
    getDate: (statistic: Statistic) => Date;
    getValue: (statistic: Statistic) => number;
    formatDate: (date: Date) => string;
    formatValue: (value: number) => string;
}
