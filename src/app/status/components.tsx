'use client';

import { SessionStatus } from '@interfaces/bot';
import { Localization, LocalizationProps } from '@interfaces/localization';
import { RedisStatus } from '@interfaces/redis';
import { buttonActionStyled } from '@lunaproject-discord/web-core/dist/components/ButtonBase';
import { OAuthGuild, OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import {
    ErrorOutlineOutlined,
    KeyboardArrowDownOutlined,
    LoginOutlined,
    TaskAltOutlined,
    WarningAmberOutlined
} from '@mui/icons-material';
import {
    Accordion as MuiAccordion,
    accordionClasses,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    AccordionSummary as MuiAccordionSummary,
    accordionSummaryClasses,
    AccordionSummaryProps,
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Chip,
    Divider,
    styled,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material';
import { getGuildIcon } from '@utils/cdn';
import NextLink from 'next/link';
import React, { Fragment } from 'react';

const getStatusColor = (status: SessionStatus) => {
    switch (status) {
        case 'CONNECTED':
            return 'success.main';
        case 'SHUTTING_DOWN':
        case 'SHUTDOWN':
        case 'FAILED_TO_LOGIN':
            return 'error.main';
        default:
            return 'warning.main';
    }
};

const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
        case 'CONNECTED':
            return TaskAltOutlined;
        case 'SHUTTING_DOWN':
        case 'SHUTDOWN':
        case 'FAILED_TO_LOGIN':
            return ErrorOutlineOutlined;
        default:
            return WarningAmberOutlined;
    }
};

const getStatusLabel = (status: SessionStatus, { translations }: Localization) => {
    switch (status) {
        case 'INITIALIZING':
        case 'INITIALIZED':
        case 'LOGGING_IN':
        case 'CONNECTING_TO_WEBSOCKET':
        case 'IDENTIFYING_SESSION':
        case 'AWAITING_LOGIN_CONFIRMATION':
            return translations.status_connecting;
        case 'LOADING_SUBSYSTEMS':
            return translations.loading;
        case 'CONNECTED':
            return translations.status_connected;
        case 'DISCONNECTED':
            return translations.status_disconnected;
        case 'RECONNECT_QUEUED':
        case 'WAITING_TO_RECONNECT':
            return translations.status_waiting_reconnect;
        case 'ATTEMPTING_TO_RECONNECT':
            return translations.status_reconnecting;
        case 'SHUTTING_DOWN':
            return translations.status_shutting_down;
        case 'SHUTDOWN':
            return translations.status_shutdown;
        case 'FAILED_TO_LOGIN':
            return translations.status_failed_to_login;
    }
};

export const StatusAccordion = styled(
    ({ children, ...props }: AccordionProps) => <MuiAccordion disableGutters elevation={0} {...props}>
        {children}
    </MuiAccordion>
)<AccordionProps>({
    padding: 0,
    backgroundColor: 'unset',
    border: 'none',
    [`&.${accordionClasses.disabled}`]: {
        backgroundColor: 'inherit'
    },
    '&::before': {
        display: 'none'
    }
});

export const StatusAccordionSummary = styled(
    (props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<KeyboardArrowDownOutlined />} {...props} />
)<AccordionSummaryProps>(({ theme }) => ({
    minHeight: 50,
    padding: theme.spacing(0, 1.5),
    gap: theme.spacing(.5),
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius,
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(180deg)'
    },
    [`& .${accordionSummaryClasses.content}`]: {
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '15% 1fr 15% 1fr',
        alignItems: 'center',
        gap: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr'
        }
    },
    ...buttonActionStyled(theme)
}));

export const StatusAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    display: 'flex',
    flexDirection: 'column'
}));

export interface StatusProps extends LocalizationProps {
    status: RedisStatus;
    user: OAuthUser | undefined;
    guilds: OAuthGuild[];
}

export const Status = ({ status: { id, status, ping }, user, guilds, localization }: StatusProps) => {
    const { translations } = localization;

    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));

    const statusColor = getStatusColor(status);
    const StatusIcon = getStatusIcon(status);
    const statusLabel = getStatusLabel(status, localization);

    return (
        <StatusAccordion>
            <StatusAccordionSummary>
                <Typography>
                    {String(translations.status_shard_with_id).replace('%id', (id + 1).toLocaleString())}
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: .5, color: statusColor }}>
                    <StatusIcon color="inherit" />
                    <Typography>
                        {status === 'CONNECTED' ? translations.online : `${translations.offline} (${statusLabel})`}
                    </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {status === 'CONNECTED' ? `${ping.toLocaleString()}ms` : '(N/A)ms'}
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: .5 }}>
                    {user && <Fragment>
                        <AvatarGroup
                            max={3}
                            slotProps={{
                                additionalAvatar: {
                                    sx: {
                                        width: 24,
                                        height: 24,
                                        fontSize: (theme) => theme.typography.body2.fontSize
                                    }
                                }
                            }}
                        >
                            {guilds.map((guild) => (
                                <Avatar
                                    key={guild.id}
                                    src={getGuildIcon(guild)}
                                    alt={guild.name}
                                    sx={{ width: 24, height: 24 }}
                                />
                            ))}
                        </AvatarGroup>
                        <Typography color="text.secondary">
                            {String(translations.status_mutual_guilds_with_count).replace('%c', guilds.length.toLocaleString())}
                        </Typography>
                    </Fragment>}
                </Box>
            </StatusAccordionSummary>
            <StatusAccordionDetails>
                <Box
                    sx={{
                        py: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'flex-start',
                        gap: 3
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {translations.status_average_ping}
                        </Typography>
                        <Typography variant="h4" color="primary.main" sx={{ fontFamily: 'Renner, sans-serif' }}>
                            {status === 'CONNECTED' ? ping.toLocaleString() : '(N/A)'}ms
                        </Typography>
                    </Box>
                    <Divider
                        orientation={isSmall ? 'vertical' : 'horizontal'}
                        flexItem
                        sx={{
                            mx: { xs: 2, sm: 0 },
                            my: { xs: 0, sm: 2 }
                        }}
                    />
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {translations.status_mutual_guilds}
                        </Typography>
                        {user ? <Fragment>
                            {guilds.length > 0 ? <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                {guilds.map((guild) => (
                                    <Chip
                                        key={guild.id}
                                        avatar={<Avatar src={getGuildIcon(guild)} alt={guild.name} />}
                                        label={guild.name}
                                    />
                                ))}
                            </Box> : <Typography>
                                {translations.status_mutual_guilds_empty}
                            </Typography>}
                        </Fragment> : <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography>{translations.status_mutual_guilds_not_logged_in}</Typography>
                            <Button
                                component={NextLink}
                                href={`https://account.lunaproject.jp/login${typeof window !== 'undefined' && window.location.href ? `?redirect=${encodeURIComponent(window.location.href)}` : ''}`}
                                disableElevation
                                variant="contained"
                                startIcon={<LoginOutlined />}
                                sx={{ width: 'fit-content' }}
                            >
                                {translations.login}
                            </Button>
                        </Box>}
                    </Box>
                </Box>
            </StatusAccordionDetails>
        </StatusAccordion>
    );
};
