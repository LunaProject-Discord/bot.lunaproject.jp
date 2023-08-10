'use client';

import { PageContent, PageHeader } from '@components/layout';
import { Statistic } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { CloudOffOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import React from 'react';


interface Props extends LocalizationProps {
    statistic: Statistic;
}

export const View = ({ statistic, localization: { translations } }: Props) => {
    const isAllConnected = Object.values(statistic.statuses.shards).every((status) => status === 'CONNECTED');

    return (
        <PageContent display="flex">
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.status}</Typography>
                    <Typography>{translations.status_description}</Typography>
                </Box>
            </PageHeader>
            {isAllConnected ? <Alert severity="success">
                すべてのシャードは正常に接続されています。
            </Alert> : <Alert severity="warning">
                <AlertTitle>{translations.warning}</AlertTitle>
                一部のシャードが接続されていない可能性があります。
            </Alert>}
            <Section>
                <SectionContent>
                    <LineChart
                        height={300}
                        series={[{ data: [1, 2, 3, 54, 234, 25, 6, 3, 2], label: 'uv', area: true }]}
                        xAxis={[{ scaleType: 'point', data: ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 6', 'Page 7', 'Page 8', 'Page 9'] }]}
                        sx={{
                            '.MuiLineElement-root, .MuiMarkElement-root': {
                                display: 'none'
                            }
                        }}
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
                <Typography variant="h4">{translations.status}</Typography>
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
                <Typography variant="h4">{translations.status}</Typography>
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
