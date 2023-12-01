'use client';

import { StatisticResponseProps } from '@app/statistics/_components/interfaces';
import { Statistic } from '@interfaces/bot';
import { Theme, useMediaQuery } from '@mui/material';
import { AreaChart as TremorAreaChart, AreaChartProps as TremorAreaChartProps } from '@tremor/react';
import React from 'react';

export interface AreaChartProps extends StatisticResponseProps, Omit<TremorAreaChartProps, 'categories' | 'data' | 'index' | 'valueFormatter'> {
    statistics: Statistic[];
    label: string;
}

export const AreaChart = ({
                              statistics,
                              label,
                              getDate,
                              getValue,
                              formatDate,
                              formatValue,
                              ...props
                          }: AreaChartProps) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    return (
        <TremorAreaChart
            autoMinValue
            categories={[label]}
            className="mt-2"
            data={statistics.map((statistic) => ({
                date: formatDate(getDate(statistic)),
                [label]: getValue(statistic)
            }))}
            index="date"
            showGradient={isDesktop}
            showLegend={false}
            showYAxis={isDesktop}
            startEndOnly={!isDesktop}
            valueFormatter={formatValue}
            {...props}
        />
    );
};
