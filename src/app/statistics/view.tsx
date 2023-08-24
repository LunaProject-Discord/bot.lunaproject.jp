'use client';

import { AreaChart } from '@app/statistics/_components';
import { StatisticsViewProps } from '@app/statistics/interfaces';
import { formatDate, getDate } from '@app/statistics/utils';
import { PageContent, PageHeader } from '@components/layout';
import { LocalizationProps } from '@interfaces/localization';
import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { CloudOffOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

type Props = StatisticsViewProps & LocalizationProps;

export const View = ({ statistics: { period: { type }, statistics }, localization }: Props) => {
    const { translations } = localization;

    return (
        <PageContent display="flex">
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.statistics}</Typography>
                    <Typography>{translations.statistics_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionTitle>Ping</SectionTitle>
                <SectionContent sx={{ height: 300 }}>
                    <AreaChart
                        statistics={statistics}
                        getDate={getDate}
                        getValue={(statistic) => statistic.pings.total}
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={(value) => `${value.toLocaleString()}ms`}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>サーバー数</SectionTitle>
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
                <SectionTitle>チャンネル数</SectionTitle>
                <SectionContent sx={{ height: 300 }}>
                    <AreaChart
                        statistics={statistics}
                        getDate={getDate}
                        getValue={(statistic) => statistic.channels.total}
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>役職数</SectionTitle>
                <SectionContent sx={{ height: 300 }}>
                    <AreaChart
                        statistics={statistics}
                        getDate={getDate}
                        getValue={(statistic) => statistic.roles.total}
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>絵文字数</SectionTitle>
                <SectionContent sx={{ height: 300 }}>
                    <AreaChart
                        statistics={statistics}
                        getDate={getDate}
                        getValue={(statistic) => statistic.emojis.total}
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>ユーザー数</SectionTitle>
                <SectionContent sx={{ height: 300 }}>
                    <AreaChart
                        statistics={statistics}
                        getDate={getDate}
                        getValue={(statistic) => statistic.users.total}
                        formatDate={(date) => formatDate(date, type)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
        </PageContent>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.statistics}</Typography>
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
                <Typography variant="h4">{translations.statistics}</Typography>
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
