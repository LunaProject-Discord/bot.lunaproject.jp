'use client';

import { Status } from '@app/status/components';
import { PageHeader } from '@components/layout';
import { PageLayout } from '@components/layout_v2';
import { LocalizationProps } from '@interfaces/localization';
import { RedisStatus } from '@interfaces/redis';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { OAuthGuild, OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { CloudOffOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material';
import { sortGuilds } from '@utils/discord';
import React, { Fragment } from 'react';

interface Props extends LocalizationProps {
    statuses: RedisStatus[];
    user: OAuthUser | undefined;
    guilds: OAuthGuild[];
}

export const View = ({ statuses, user, guilds, localization }: Props) => {
    const { translations } = localization;

    const isAllConnected = statuses.every(({ status }) => status === 'CONNECTED');
    const isAllDisconnected = statuses.every(({ status }) => status !== 'CONNECTED');

    return (
        <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.status}</Typography>
                    <Typography>{translations.status_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    {!isAllDisconnected ? <Fragment>
                        {isAllConnected ? <Alert severity="success">
                            <AlertTitle>{translations.online}</AlertTitle>
                            {translations.status_all_connected}
                        </Alert> : <Alert severity="warning">
                            <AlertTitle>{translations.online} ({translations.warning})</AlertTitle>
                            {translations.status_any_connected}
                        </Alert>}
                    </Fragment> : <Alert severity="error">
                        <AlertTitle>{translations.offline}</AlertTitle>
                        {translations.status_all_disconnected}
                    </Alert>}
                </SectionContent>
            </Section>
            <Section>
                <SectionContent>
                    {statuses.map((status) => (
                        <Status
                            key={status.id}
                            status={status}
                            user={user}
                            guilds={sortGuilds(guilds.filter((guild) => (BigInt(guild.id) >> 22n) % BigInt(statuses.length) === BigInt(status.id)))}
                            localization={localization}
                        />
                    ))}
                </SectionContent>
            </Section>
        </PageLayout>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.status}</Typography>
                <Typography>{translations.loading}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageLayout>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
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
    </PageLayout>
);
