'use client';

import { ErrorIcon, LoginIcon, TaskAltIcon, WarningIcon } from '@/components/icons';
import { SessionStatus } from '@/interfaces/bot';
import { Localization, LocalizationProps } from '@/interfaces/localization';
import { RedisStatus } from '@/interfaces/redis';
import { getGuildIcon } from '@/utils/cdn';
import {
    SectionAccordionCard,
    SectionAccordionCardHeaderIcon,
    SectionAccordionCardRootProps,
    SectionButtonCardRoot,
    sectionCardClasses,
    SectionCardDisplay,
    SectionCardProps,
    SectionCardRoot,
    SectionCardVariantProps,
    SlotRootProps
} from '@lunaproject/web-core/dist/components/SectionCard';
import { ConfigContext, generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { OAuthGuild, OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { SlotComponentProps } from '@mui/base';
import {
    Avatar,
    AvatarGroup,
    Box,
    BoxProps,
    Button,
    ButtonBaseProps,
    Chip,
    darken,
    Divider,
    lighten,
    styled,
    SvgIcon,
    Theme,
    Typography,
    typographyClasses,
    TypographyProps,
    useMediaQuery
} from '@mui/material';
import { BoxTypeMap } from '@mui/system';
import clsx from 'clsx';
import NextLink from 'next/link';
import React, { ElementType, Fragment, useContext, useState } from 'react';

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
            return TaskAltIcon;
        case 'SHUTTING_DOWN':
        case 'SHUTDOWN':
        case 'FAILED_TO_LOGIN':
            return ErrorIcon;
        default:
            return WarningIcon;
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

export const sectionStatusCardClasses = generateComponentClasses(
    'SectionStatusCard',
    [
        'root',
        'shard',
        'status',
        'ping',
        'guilds',
        'icon'
    ]
);

export const SectionStatusCardStatusRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionStatusCardClasses.status, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5)
}));

export interface SectionStatusCardStatusProps extends Omit<BoxProps, 'children'>, LocalizationProps {
    status: SessionStatus;
    slotProps?: {
        icon?: SlotComponentProps<typeof SvgIcon, SlotRootProps, {}>;
        label?: SlotComponentProps<typeof Typography, SlotRootProps, {}>;
    };
}

export const SectionStatusCardStatus = (
    {
        status,
        slotProps: {
            icon: iconProps,
            label: labelProps
        } = {},
        sx,
        localization: { translations },
        ...props
    }: SectionStatusCardStatusProps
) => {
    const statusColor = getStatusColor(status);
    const StatusIcon = getStatusIcon(status);

    return (
        <SectionStatusCardStatusRoot sx={{ color: statusColor, ...sx }} {...props}>
            <StatusIcon color="inherit" {...iconProps} />
            <Typography {...labelProps}>{translations[status === 'CONNECTED' ? 'online' : 'offline']}</Typography>
        </SectionStatusCardStatusRoot>
    );
};


export const SectionStatusCardPing = ({ color, className, ...props }: TypographyProps) => (
    <Typography
        color={color ?? 'text.secondary'}
        className={clsx(sectionStatusCardClasses.ping, className)}
        {...props}
    />
);

export const SectionStatusCardGuildsRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionStatusCardClasses.guilds, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5)
}));

export interface SectionStatusCardGuildsProps extends Omit<BoxProps, 'children'>, LocalizationProps {
    user: OAuthUser;
    guilds: OAuthGuild[];
    slotProps?: {
        avatar?: SlotComponentProps<typeof Avatar, SlotRootProps, {}>;
        avatarGroup?: SlotComponentProps<typeof AvatarGroup, SlotRootProps, {}>;
        label?: SlotComponentProps<typeof Typography, SlotRootProps, {}>;
    };
}

export const SectionStatusCardGuilds = (
    {
        user,
        guilds,
        slotProps: {
            avatar: avatarProps,
            avatarGroup: avatarGroupProps,
            label: labelProps
        } = {},
        localization: { translations },
        ...props
    }: SectionStatusCardGuildsProps
) => (
    <SectionStatusCardGuildsRoot {...props}>
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
            {...avatarGroupProps}
        >
            {guilds.map((guild) => (
                <Avatar
                    key={guild.id}
                    src={getGuildIcon(guild)}
                    alt={guild.name}
                    sx={{ width: 24, height: 24 }}
                    {...avatarProps}
                />
            ))}
        </AvatarGroup>
        <Typography color="text.secondary" {...labelProps}>
            {String(translations.status_mutual_guilds_with_count).replace('%c', guilds.length.toLocaleString())}
        </Typography>
    </SectionStatusCardGuildsRoot>
);


export const SectionStatusCardContentAlert = styled(SectionCardRoot)(({ theme }) => ({
    color: (theme.palette.mode === 'light' ? darken : lighten)(theme.palette.error.light, .6),
    backgroundColor: (theme.palette.mode === 'light' ? lighten : darken)(theme.palette.error.light, .9),
    [`& .${typographyClasses.root}`]: {
        marginTop: theme.spacing(.25)
    }
}));

export const SectionStatusCardContentDetails = styled(SectionCardRoot)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    gap: `${theme.spacing(2)} !important`,
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        gap: `${theme.spacing(3)} !important`
    },
    [`.${sectionCardClasses.variantStandard} &`]: {
        // パディング: 12px
        padding: `${theme.spacing(1.5)} !important`,
        [theme.breakpoints.up('md')]: {
            /**
             * [上下] パディング: 12px
             * [左] パディング: 12px + アイコン: 24px + アイコンパディング (左右): 8px + ギャップ: 12px
             * [右] パディング: 12px + アイコン: 24px + ギャップ: 8px
             */
            padding: `${theme.spacing(1.5, 5.5, 1.5, 7)} !important`
        }
    },
    [`.${sectionCardClasses.variantOutlined} &`]: {
        /**
         * [上] (ボーダー: 1px) + パディング: 11px
         * [下] パディング: 12px
         * [左右] (ボーダー: 1px) + パディング: 11px
         */
        padding: `${theme.spacing(1.375, 1.375, 1.5)} !important`,
        [theme.breakpoints.up('md')]: {
            /**
             * [上] (ボーダー: 1px) + パディング: 11px
             * [下] パディング: 12px
             * [左] (ボーダー: 1px) + パディング: 11px + アイコン: 24px + アイコンパディング (左右): 8px + ギャップ: 12px
             * [右] (ボーダー: 1px) + パディング: 11px + アイコン: 24px + ギャップ: 8px
             */
            padding: `${theme.spacing(1.375, 5.375, 1.5, 6.875)} !important`
        }
    }
}));

export const SectionStatusCardRoot = styled(
    ({ className, ...props }: ButtonBaseProps) => (
        <SectionButtonCardRoot
            className={clsx(sectionStatusCardClasses.root, className)}
            {...props}
        />
    )
)<ButtonBaseProps & SectionCardVariantProps>(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '15% 1fr 15% 1fr 24px',
    [`& .${sectionStatusCardClasses.shard}`]: {
        gridColumn: 1
    },
    [`& .${sectionStatusCardClasses.status}`]: {
        gridColumn: 2
    },
    [`& .${sectionStatusCardClasses.ping}`]: {
        gridColumn: 3
    },
    [`& .${sectionStatusCardClasses.guilds}`]: {
        gridColumn: 4
    },
    [`& .${sectionStatusCardClasses.icon}`]: {
        gridColumn: 5
    },
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr 1fr 24px',
        [`& .${sectionStatusCardClasses.shard}`]: {
            gridColumn: 1
        },
        [`& .${sectionStatusCardClasses.status}`]: {
            gridColumn: 2
        },
        [`& .${sectionStatusCardClasses.ping}, & .${sectionStatusCardClasses.guilds}`]: {
            display: 'none'
        },
        [`& .${sectionStatusCardClasses.icon}`]: {
            gridColumn: 3
        }
    }
}));

export interface SectionStatusCardRootProps extends LocalizationProps {
    status: RedisStatus;
    user: OAuthUser | undefined;
    guilds: OAuthGuild[];
}

export type SectionStatusCardProps<C extends ElementType = BoxTypeMap['defaultComponent']> =
    & Pick<SectionCardProps<C>, 'disabled' | 'variant' | 'className' | 'sx'>
    & Pick<SectionAccordionCardRootProps, 'defaultExpanded' | 'readOnly'>
    & SectionStatusCardRootProps;

export const SectionStatusCard = (
    {
        status: { id, status, ping },
        user,
        guilds,
        defaultExpanded: _defaultExpanded,
        disabled: _disabled,
        readOnly: _readOnly,
        variant: _variant,
        localization,
        ...props
    }: SectionStatusCardProps
) => {
    const { translations } = localization;

    const config = useContext(ConfigContext);
    const {
        disabled: configRootDisabled,
        variant: configRootVariant
    } = config.components?.SectionCard ?? {};
    const {
        defaultExpanded: configDefaultExpanded,
        disabled: configDisabled,
        readOnly: configReadOnly,
        variant: configVariant
    } = config.components?.SectionAccordionCard ?? {};
    const ExpandMore = config.icons.ExpandMore;

    const defaultExpanded = _defaultExpanded ?? configDefaultExpanded;
    const disabled = _disabled ?? configDisabled ?? configRootDisabled;
    const readOnly = _readOnly ?? configReadOnly;
    const variant = _variant ?? configVariant ?? configRootVariant;

    const [expanded, setExpanded] = useState(Boolean(defaultExpanded));

    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));

    const statusLabel = getStatusLabel(status, localization);
    const isConnected = status === 'CONNECTED';

    return (
        <SectionAccordionCard
            header={
                <SectionStatusCardRoot onClick={() => setExpanded(!expanded)} disabled={disabled} variant={variant}>
                    <SectionCardDisplay
                        primary={String(translations.status_shard_with_id).replace('%id', (id + 1).toLocaleString())}
                        slotProps={{
                            root: {
                                className: sectionStatusCardClasses.shard
                            }
                        }}
                    />
                    <SectionStatusCardStatus status={status} localization={localization} />
                    {isConnected && <SectionStatusCardPing>{ping.toLocaleString()}ms</SectionStatusCardPing>}
                    {user && <SectionStatusCardGuilds user={user} guilds={guilds} localization={localization} />}
                    <SectionAccordionCardHeaderIcon className={sectionStatusCardClasses.icon}>
                        <ExpandMore color={!disabled ? 'action' : 'disabled'} />
                    </SectionAccordionCardHeaderIcon>
                </SectionStatusCardRoot>
            }
            expanded={expanded}
            setExpanded={setExpanded}
            defaultExpanded={defaultExpanded}
            disabled={disabled}
            readOnly={readOnly}
            variant={variant}
            slotProps={{
                items: {
                    unmountOnExit: true
                }
            }}
            {...props}
        >
            {!isConnected && <SectionStatusCardContentAlert>
                <ErrorIcon color="error" />
                <Typography fontWeight={500} color="inherit">{translations.offline}</Typography>
                <Typography color="inherit">{statusLabel}</Typography>
            </SectionStatusCardContentAlert>}
            <SectionStatusCardContentDetails>
                {isConnected && <Fragment>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {translations.status_average_ping}
                        </Typography>
                        <Typography variant="h4" color="primary.main" sx={{ fontFamily: 'Renner, sans-serif' }}>
                            {ping.toLocaleString()}ms
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
                </Fragment>}
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
                            startIcon={<LoginIcon />}
                            sx={{ width: 'fit-content' }}
                        >
                            {translations.login}
                        </Button>
                    </Box>}
                </Box>
            </SectionStatusCardContentDetails>
        </SectionAccordionCard>
    );
};
