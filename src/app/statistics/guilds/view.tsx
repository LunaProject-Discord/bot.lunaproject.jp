'use client';

import { AreaChart, DataGrid } from '@app/statistics/_components';
import { LatestWidget, MaxWidget, MinWidget } from '@app/statistics/_components/widgets';
import { StatisticsViewProps } from '@app/statistics/interfaces';
import { formatDate, getDate, getMaxShards } from '@app/statistics/utils';
import { PageContent, PageHeader } from '@components/layout';
import { Statistic } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { CloudOffOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { GridColDef, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import { max, min } from '@utils/array';
import React from 'react';

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
            valueFormatter: (params) => formatDate(params.value, type),
            width: 250
        },
        {
            field: 'total',
            type: 'number',
            headerName: String(translations.statistics_table_total),
            valueFormatter: (params) => params.value.toLocaleString(),
            width: 120
        },
        ...Object.keys(shards).map((shard): GridColDef<GridValidRowModel, number | undefined, string> => ({
            field: `shard_${shard}`,
            type: 'number',
            headerName: String(translations.statistics_table_shard_with_id).replace('%id', (Number(shard) + 1).toLocaleString()),
            valueFormatter: (params) => params.value?.toLocaleString() ?? 'N/A',
            width: 120
        }))
    ];
    const gridRows: GridRowsProp = statistics.map((statistic) => ({
        id: statistic.id,
        date: getDate(statistic),
        total: statistic.guilds.total,
        ...Object.entries(statistic.guilds.shards).reduce((acc, [key, value]) => ({ ...acc, [`shard_${key}`]: value }), {})
    }));


    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.guilds}</Typography>
                    <Typography>{translations.statistics_description}</Typography>
                </Box>
            </PageHeader>
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
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={formatValue}
                        localization={localization}
                    />}
                    {maxStatistic && <MaxWidget
                        statistic={maxStatistic}
                        getDate={getDate}
                        getValue={getValue}
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={formatValue}
                        localization={localization}
                    />}
                </Grid>
            </Section>
            <Section>
                <SectionContent sx={{ height: 300 }}>
                    <AreaChart
                        statistics={statistics}
                        getDate={getDate}
                        getValue={getValue}
                        formatDate={(date) => formatDate(date, type)}
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
        </PageContent>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.guilds}</Typography>
                <Typography>{translations.loading}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageContent>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.guilds}</Typography>
                <Typography />
            </Box>
        </PageHeader>
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
            <CloudOffOutlined color="primary" sx={{ fontSize: '10rem' }} />
            <Typography variant="h4">データがありません</Typography>
            <Typography align="center">
                現在、表示できるデータはありません。<br />
                しばらく待ってから再度お試しください。
            </Typography>
        </Box>
    </PageContent>
);
