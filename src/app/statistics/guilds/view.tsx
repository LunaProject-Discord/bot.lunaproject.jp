'use client';

import { AreaChart } from '@app/statistics/_components';
import { StatisticsViewProps } from '@app/statistics/interfaces';
import { formatDate, getDate } from '@app/statistics/utils';
import { PageContent, PageHeader } from '@components/layout';
import { Statistic } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { CloudOffOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Paper, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid';
import React from 'react';

interface Props extends StatisticsViewProps, LocalizationProps {
    statistic: Statistic;
}

export const View = ({ statistic, statistics: { period: { type }, statistics }, localization: { translations } }: Props) => {
    const latestStatistic = statistics[statistics.length - 1];

    const shards = statistics.sort((a, b) => Object.keys(b.guilds.shards).length - Object.keys(a.guilds.shards).length)[0].guilds.shards;

    const gridColumns: GridColDef[] = [
        {
            field: 'date',
            type: 'dateTime',
            headerName: '日付',
            valueFormatter: (params) => formatDate(params.value, type),
            width: 250
        },
        {
            field: 'total',
            type: 'number',
            headerName: '合計',
            valueFormatter: (params) => params.value.toLocaleString(),
            width: 120
        },
        ...Object.entries(shards).map(([key, value]): GridColDef => ({
            field: `shard_${key}`,
            type: 'number',
            headerName: `シャード #${Number(key) + 1}`,
            valueFormatter: (params) => params.value.toLocaleString(),
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
                    <Grid xs={12} md={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                color: 'primary.contrastText',
                                bgcolor: 'primary.main',
                                borderRadius: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                                <Typography variant="caption">速報値</Typography>
                                <Typography variant="h4" sx={{ fontFamily: 'Renner, sans-serif' }}>
                                    {statistic.guilds.total.toLocaleString()}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    {(statistic.id !== latestStatistic.id && statistic.guilds.total !== latestStatistic.guilds.total) &&
                        <Grid xs={12} md={3}>
                            <Paper variant="outlined" elevation={0} sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                                    <Typography variant="caption">
                                        {formatDate(getDate(latestStatistic), type)} 時点の合計
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontFamily: 'Renner, sans-serif' }}>
                                        {latestStatistic.guilds.total.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    }
                </Grid>
            </Section>
            <Section>
                <SectionContent sx={{ height: 300 }}>
                    <AreaChart
                        statistics={statistics}
                        getDate={getDate}
                        getValue={(statistic) => statistic.guilds.total}
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={(value) => value.toLocaleString()}
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
                    slots={{
                        toolbar: GridToolbar
                    }}
                    slotProps={{
                        toolbar: {
                            printOptions: { disableToolbarButton: true },
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 }
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
