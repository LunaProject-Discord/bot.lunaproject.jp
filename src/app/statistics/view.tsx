'use client';

import { AreaChart } from '@app/statistics/_components';
import { StatisticsViewProps } from '@app/statistics/interfaces';
import { formatDate, getDate } from '@app/statistics/utils';
import { PageHeader } from '@components/layout';
import { LocalizationProps } from '@interfaces/localization';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { CloudOffOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { Fragment } from 'react';

type Props = StatisticsViewProps & LocalizationProps;

export const View = ({ statistics: { period: { type }, statistics }, localization }: Props) => {
    const { translations } = localization;

    return (
        <Fragment>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.statistics}</Typography>
                    <Typography>{translations.statistics_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionTitle>{translations.ping}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.ping as string}
                        getDate={getDate}
                        getValue={(statistic) => statistic.pings.total}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={(value) => `${value.toLocaleString()}ms`}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.guilds}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.guild as string}
                        getDate={getDate}
                        getValue={(statistic) => statistic.guilds.total}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.channels}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.channel as string}
                        getDate={getDate}
                        getValue={(statistic) => statistic.channels.total}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.roles}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.role as string}
                        getDate={getDate}
                        getValue={(statistic) => statistic.roles.total}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.emojis}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.emoji as string}
                        getDate={getDate}
                        getValue={(statistic) => statistic.emojis.total}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.users}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.user as string}
                        getDate={getDate}
                        getValue={(statistic) => statistic.users.total}
                        formatDate={(date) => formatDate(date, type, localization)}
                        formatValue={(value) => value.toLocaleString()}
                    />
                </SectionContent>
            </Section>
        </Fragment>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.statistics}</Typography>
                <Typography>{translations.loading}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
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
    </Fragment>
);
