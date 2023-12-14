'use client';

import { AreaChart, DataGrid } from '@app/statistics/_components';
import { LatestWidget, MaxWidget, MinWidget } from '@app/statistics/_components/widgets';
import { StatisticsViewProps } from '@app/statistics/interfaces';
import { formatDate, getDate, getMaxShards } from '@app/statistics/utils';
import { CloudOffIcon } from '@components/icons';
import { PageHeader } from '@components/layout_v2';
import { Statistic } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { Box, CircularProgress, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { GridColDef, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import { max, min } from '@utils/array';
import React, { Fragment } from 'react';

const getValue = (statistic: Statistic) => statistic.guilds.total;
const formatValue = (value: number) => value.toLocaleString();

interface Props extends StatisticsViewProps, LocalizationProps {
    statistic: Statistic;
}

export const View = ({ statistic, statistics: { period: { type }, statistics }, localization }: Props) => {
    const { translations } = localization;

    const latestStatistic = statistics[statistics.length - 1];
    const minStatistic = min(statistics, getValue);
    const maxStatistic = max(statistics, getValue);

    const shards = getMaxShards(statistics, (statistic) => statistic.guilds.shards);

    const gridColumns: GridColDef[] = [
        {
            field: 'date',
            type: 'dateTime',
            headerName: String(translations.statistics_table_date),
            valueFormatter: (params) => formatDate(params.value, type, localization),
            width: 250
        },
        {
            field: 'total',
            type: 'number',
            headerName: String(translations.statistics_table_total),
            valueFormatter: (params) => formatValue(params.value),
            width: 120
        },
        ...Object.keys(shards).map((shard): GridColDef<GridValidRowModel, number | undefined, string> => ({
            field: `shard_${shard}`,
            type: 'number',
            headerName: String(translations.statistics_table_shard_with_id).replace('%id', (Number(shard) + 1).toLocaleString()),
            valueFormatter: (params) => params.value ? formatValue(params.value) : 'N/A',
            width: 120
        }))
    ];
    const gridRows: GridRowsProp = statistics.map((statistic) => ({
        id: statistic.id,
        date: getDate(statistic),
        total: getValue(statistic),
        ...Object.entries(statistic.guilds.shards).reduce((acc, [key, value]) => ({
            ...acc,
            [`shard_${key}`]: value
        }), {})
    }));


    return (
        <Fragment>
            <PageHeader primary={translations.guilds} secondary={translations.statistics_description} />
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
                        label={translations.guild as string}
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
        <PageHeader primary={translations.guilds} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.guilds} />
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                placeContent: 'center',
                gap: 1
            }}
        >
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <Typography variant="h4">データがありません</Typography>
            <Typography align="center">
                現在、表示できるデータはありません。<br />
                しばらく待ってから再度お試しください。
            </Typography>
        </Box>
    </Fragment>
);
