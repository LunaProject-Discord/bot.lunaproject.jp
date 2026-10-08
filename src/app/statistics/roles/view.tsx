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
import { DateTime } from 'luxon';
import React, { Fragment, useCallback, useMemo } from 'react';

const getValue = (statistic: Statistic) => statistic.roles.total;
const formatValue = (value: number) => value.toLocaleString();

interface Props extends StatisticsViewProps, LocalizationProps {
    statistic: Statistic;
}

export const View = ({ statistic, statistics: { period: { type }, statistics }, localization }: Props) => {
    const { translations } = localization;

    const latestStatistic = useMemo(() => statistics[statistics.length - 1], [statistics]);
    const minStatistic = useMemo(() => min(statistics, getValue), [statistics]);
    const maxStatistic = useMemo(() => max(statistics, getValue), [statistics]);

    const shards = useMemo(() => getMaxShards(statistics, (statistic) => statistic.roles.shards), [statistics]);

    const gridColumns = useMemo<GridColDef[]>(() => [
        {
            field: 'date',
            type: 'dateTime',
            headerName: String(translations.statistics_table_date),
            valueFormatter: (value: DateTime<true>) => formatDate(value, type, localization),
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
    ], [localization, shards, translations, type]);
    const gridRows = useMemo<GridRowsProp>(() => statistics.map((statistic) => ({
        id: statistic.id,
        date: getDate(statistic),
        total: getValue(statistic),
        ...Object.fromEntries(
            Object.entries(statistic.roles.shards).map(([key, value]) => ([
                `shard_${key}`,
                value
            ]))
        )
    })), [statistics]);

    const formatDateTime = useCallback(
        (date: DateTime<true>) => formatDate(date, type, localization),
        [localization, type]
    );

    return (
        <Fragment>
            <PageHeader primary={translations.roles} secondary={translations.statistics_description} />
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
                        formatDate={formatDateTime}
                        formatValue={formatValue}
                        localization={localization}
                    />}
                    {maxStatistic && <MaxWidget
                        statistic={maxStatistic}
                        getDate={getDate}
                        getValue={getValue}
                        formatDate={formatDateTime}
                        formatValue={formatValue}
                        localization={localization}
                    />}
                </Grid>
            </Section>
            <Section>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.role as string}
                        getDate={getDate}
                        getValue={getValue}
                        formatDate={formatDateTime}
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
        <PageHeader primary={translations.roles} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.roles} />
        <ErrorRoot sx={{ height: (theme) => `calc(100% - ${theme.spacing(5.25)})` }}>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>{translations.error_data_not_found_title}</ErrorTitle>
            <ErrorDescription>{translations.error_data_not_found_description}</ErrorDescription>
        </ErrorRoot>
    </Fragment>
);
