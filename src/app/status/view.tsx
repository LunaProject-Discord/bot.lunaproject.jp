'use client';

import { Status } from '@app/status/components';
import { PageContent, PageHeader } from '@components/layout';
import { LocalizationProps } from '@interfaces/localization';
import { RedisStatus } from '@interfaces/redis';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { OAuthGuild, OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { CloudOffOutlined } from '@mui/icons-material';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { sortGuilds } from '@utils/discord';
import React from 'react';

interface Props extends LocalizationProps {
    user: OAuthUser | undefined;
    guilds: OAuthGuild[];
    statuses: RedisStatus[];
}

export const View = ({ guilds, statuses, localization }: Props) => {
    const { translations } = localization;

    const isAllConnected = statuses.every(({ status }) => status === 'CONNECTED');

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.status}</Typography>
                    <Typography>{translations.status_description}</Typography>
                </Box>
            </PageHeader>
            {isAllConnected ? <Alert severity="success" sx={{ mt: 3 }}>
                すべてのシャードは正常に接続されています。
            </Alert> : <Alert severity="warning" sx={{ mt: 3 }}>
                いくつかのシャードが接続されていない可能性があります。
            </Alert>}
            <Section>
                <SectionContent>
                    {statuses.map((status) => (
                        <Status
                            key={status.id}
                            status={status}
                            guilds={sortGuilds(guilds.filter((guild) => (BigInt(guild.id) >> 22n) % BigInt(statuses.length) === BigInt(status.id)))}
                            localization={localization}
                        />
                    ))}
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
