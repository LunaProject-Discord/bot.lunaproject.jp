'use client';

import { StatisticResponseProps } from '@app/statistics/_components/interfaces';
import { getDate } from '@app/statistics/utils';
import { TodayIcon, TrendingDownIcon, TrendingFlatIcon, TrendingUpIcon } from '@components/icons';
import { Statistic, StatisticsPeriodType } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { format } from '@lunaproject/web-core/dist/utils/date';
import { SvgIconComponent } from '@mui/icons-material';
import { Box, Paper, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import {
    differenceInCalendarWeeks,
    differenceInHours,
    isSameDay,
    isSameHour,
    isSameMonth,
    isSameWeek,
    isSameYear,
    subDays,
    subMonths,
    subWeeks
} from 'date-fns';
import React, { ReactNode } from 'react';

export interface StatisticWidgetDifference<T> {
    positive: T;
    negative: T;
    neutral: T;
}

export type StatisticWidgetDifferenceColors = StatisticWidgetDifference<string>;

export const DefaultStatisticWidgetDifferenceColors: StatisticWidgetDifferenceColors = {
    positive: 'success.dark',
    negative: 'error.dark',
    neutral: 'info.dark'
};

export type StatisticWidgetDifferenceIcons = StatisticWidgetDifference<SvgIconComponent>;

export const DefaultStatisticWidgetDifferenceIcons: StatisticWidgetDifferenceIcons = {
    positive: TrendingUpIcon,
    negative: TrendingDownIcon,
    neutral: TrendingFlatIcon
};

const getDifferenceColor = (percentage: number, { positive, negative, neutral }: StatisticWidgetDifferenceColors) => {
    if (percentage > 0) {
        return positive;
    } else if (percentage < 0) {
        return negative;
    } else {
        return neutral;
    }
};

const getDifferenceIcon = (percentage: number, { positive, negative, neutral }: StatisticWidgetDifferenceIcons) => {
    if (percentage > 0) {
        return positive;
    } else if (percentage < 0) {
        return negative;
    } else {
        return neutral;
    }
};

export const getDefaultDifferenceLabel = (latest: Statistic, difference: Statistic, type: StatisticsPeriodType) => {
    switch (type) {
        case 'hours':
            if (isSameHour(getDate(latest), getDate(difference)))
                return '';
            return `${differenceInHours(getDate(latest), getDate(difference))}時間前との差`;
        case 'days':
            if (isSameDay(getDate(latest), getDate(difference)))
                return '';
            if (isSameDay(subDays(getDate(latest), 1), getDate(difference)))
                return '昨日との差';
            if (isSameMonth(getDate(latest), getDate(difference)))
                return `${format(getDate(difference), 'd日')}との差`;
            if (isSameYear(getDate(latest), getDate(difference)))
                return `${format(getDate(difference), 'M月d日')}との差`;
            return `${format(getDate(difference), 'y年M月d日')}との差`;
        case 'weeks':
            if (isSameWeek(getDate(latest), getDate(difference)))
                return '';
            if (isSameWeek(subWeeks(getDate(latest), 1), getDate(difference)))
                return '先週との差';
            return `${differenceInCalendarWeeks(getDate(latest), getDate(difference))}週間前との差`;
        case 'months':
            if (isSameMonth(getDate(latest), getDate(difference)))
                return '';
            if (isSameMonth(subMonths(getDate(latest), 1), getDate(difference)))
                return '先月との差';
            if (isSameYear(getDate(latest), getDate(difference)))
                return `${format(getDate(difference), 'M月')}との差`;
            return `${format(getDate(difference), 'y年M月')}との差`;
    }
};

export interface WidgetProps extends LocalizationProps, StatisticResponseProps {
    statistic: Statistic;
}

export interface LatestWidgetProps extends Omit<WidgetProps, 'getDate' | 'formatDate'> {
    difference: Statistic;
    getDifferenceValue?: (latest: Statistic, difference: Statistic) => number;
    type: StatisticsPeriodType;

    differenceColors?: StatisticWidgetDifferenceColors;
    differenceIcons?: StatisticWidgetDifferenceIcons;
    getDifferenceLabel?: (latest: Statistic, difference: Statistic, type: StatisticsPeriodType) => ReactNode;
}

export const LatestWidget = (
    {
        statistic,
        difference,
        getValue,
        getDifferenceValue = (latest, difference) => (getValue(latest) - getValue(difference)) / getValue(difference),
        formatValue,
        type,
        differenceColors = DefaultStatisticWidgetDifferenceColors,
        differenceIcons = DefaultStatisticWidgetDifferenceIcons,
        getDifferenceLabel = (latest, difference, type) => getDefaultDifferenceLabel(latest, difference, type),
        localization: { translations }
    }: LatestWidgetProps
) => {
    const percentage = getDifferenceValue(statistic, difference);
    const formattedPercentage = (percentage * 100).toFixed(2);

    const differenceColor = getDifferenceColor(percentage, differenceColors);
    const DifferenceIcon = getDifferenceIcon(percentage, differenceIcons);
    const differenceLabel = getDifferenceLabel(statistic, difference, type);

    return (
        <Grid xs={12} md={3}>
            <Paper variant="outlined" elevation={0} sx={{ p: 3, borderColor: 'primary.main' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="caption" color="text.secondary">
                        {translations.statistics_widget_live}
                    </Typography>
                    <Typography variant="h4" color="primary.main" sx={{ fontFamily: 'Renner, sans-serif' }}>
                        {formatValue(getValue(statistic))}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                        <DifferenceIcon fontSize="small" sx={{ color: differenceColor }} />
                        <Typography variant="body2" color={differenceColor}>
                            {formattedPercentage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {differenceLabel}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
};

export const MinWidget = (
    {
        statistic,
        getDate,
        getValue,
        formatDate,
        formatValue,
        localization: { translations }
    }: WidgetProps
) => (
    <Grid xs={12} md={3}>
        <Paper variant="outlined" elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="caption" color="text.secondary">
                    {translations.statistics_widget_min}
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: 'Renner, sans-serif' }}>
                    {formatValue(getValue(statistic))}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: .5, color: 'text.secondary' }}>
                    <TodayIcon fontSize="small" color="inherit" />
                    <Typography variant="body2">
                        {formatDate(getDate(statistic))}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    </Grid>
);

export const MaxWidget = (
    {
        statistic,
        getDate,
        getValue,
        formatDate,
        formatValue,
        localization: { translations }
    }: WidgetProps
) => (
    <Grid xs={12} md={3}>
        <Paper variant="outlined" elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="caption" color="text.secondary">
                    {translations.statistics_widget_max}
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: 'Renner, sans-serif' }}>
                    {formatValue(getValue(statistic))}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: .5, color: 'text.secondary' }}>
                    <TodayIcon fontSize="small" color="inherit" />
                    <Typography variant="body2">
                        {formatDate(getDate(statistic))}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    </Grid>
);
