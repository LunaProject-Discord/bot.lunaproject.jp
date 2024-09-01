'use client';

import { AreaChart, DataGrid } from '@/app/statistics/_components';
import { LatestWidget, MaxWidget, MinWidget } from '@/app/statistics/_components/widgets';
import { StatisticsViewProps } from '@/app/statistics/interfaces';
import { formatDate, getDate, getMaxShards } from '@/app/statistics/utils';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon } from '@/components/icons';
import { Statistic } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { max, min } from '@lunaproject/web-core/dist/utils';
import { CircularProgress, Grid2 as Grid } from '@mui/material';
import { GridColDef, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import React, { Fragment } from 'react';

const getValue = (statistic: Statistic) => statistic.users.total;
const formatValue = (value: number) => value.toLocaleString();

interface Props extends StatisticsViewProps, LocalizationProps {
    statistic: Statistic;
}

export const View = ({ statistic, statistics: { period: { type }, statistics }, localization }: Props) => {
    const { translations } = localization;

    const latestStatistic = statistics[statistics.length - 1];
    const minStatistic = min(statistics, getValue);
    const maxStatistic = max(statistics, getValue);

    const shards = getMaxShards(statistics, (statistic) => statistic.users.shards);

    const gridColumns: GridColDef[] = [
        {
            field: 'date',
            type: 'dateTime',
            headerName: String(translations.statistics_table_date),
            valueFormatter: (value: Date) => formatDate(value, type, localization),
            width: 250
        },
        {
            field: 'total',
            type: 'number',
            headerName: String(translations.statistics_table_total),
            valueFormatter: (value: number) => formatValue(value),
            width: 120
        },
        ...Object.keys(shards).map((shard): GridColDef<GridValidRowModel, number | undefined, string> => ({
            field: `shard_${shard}`,
            type: 'number',
            headerName: String(translations.statistics_table_shard_with_id).replace('%id', (Number(shard) + 1).toLocaleString()),
            valueFormatter: (value: number | undefined) => value ? formatValue(value) : 'N/A',
            width: 120
        }))
    ];
    const gridRows: GridRowsProp = statistics.map((statistic) => ({
        id: statistic.id,
        date: getDate(statistic),
        total: getValue(statistic),
        ...Object.entries(statistic.users.shards).reduce((acc, [key, value]) => ({
            ...acc,
            [`shard_${key}`]: value.total
        }), {})
    }));


    return (
        <Fragment>
            <PageHeader primary={translations.users} secondary={translations.statistics_description} />
            <Section>
                <Grid container spacing={2}>
                    <LatestWidget
                        statistic={statistic}
                        difference={latestStatistic}
                        getValue={getValue}
                        formatValue={formatValue}
                        type={type}
                        localization={localization}
                    />
                    {minStatistic && <MinWidget
                        statistic={minStatistic}
                        getDate={getDate}
                        getValue={getValue}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={formatValue}
                        localization={localization}
                    />}
                    {maxStatistic && <MaxWidget
                        statistic={maxStatistic}
                        getDate={getDate}
                        getValue={getValue}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={formatValue}
                        localization={localization}
                    />}
                </Grid>
            </Section>
            <Section>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.user as string}
                        getDate={getDate}
                        getValue={getValue}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={formatValue}
                    />
                </SectionContent>
            </Section>
            <Section>
                <DataGrid
                    columns={gridColumns}
                    rows={gridRows}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'date', sort: 'desc' }]
                        }
                    }}
                />
            </Section>
        </Fragment>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.users} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.users} />
        <ErrorRoot sx={{ height: (theme) => `calc(100% - ${theme.spacing(5.25)})` }}>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>{translations.error_data_not_found_title}</ErrorTitle>
            <ErrorDescription>{translations.error_data_not_found_description}</ErrorDescription>
        </ErrorRoot>
    </Fragment>
);
