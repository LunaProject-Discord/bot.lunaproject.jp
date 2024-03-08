'use client';

import { Status } from '@/app/status/components';
import { CloudOffIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { RedisStatus } from '@/interfaces/redis';
import { sortGuilds } from '@/utils/discord';
import { PageHeader, PageLayout } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { OAuthGuild, OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material';
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
            <PageHeader primary={translations.status} secondary={translations.status_description} />
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
        <PageHeader primary={translations.status} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageLayout>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
        <PageHeader primary={translations.status} />
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
    </PageLayout>
);
