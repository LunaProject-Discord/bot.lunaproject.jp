'use client';

import { UserPopoverProps, userPopoverStateAtom } from '@app/_popovers';
import {
    ArrowBackIcon,
    BrushIcon,
    KeyboardArrowRightIcon,
    LogoutIcon,
    ManageAccountsIcon,
    OpenInNewIcon,
    SettingsIcon,
    TranslateIcon
} from '@components/icons';
import { LocaleType } from '@interfaces/localization';
import {
    alpha,
    Avatar,
    Box,
    Divider,
    getOverlayAlpha,
    IconButton,
    List,
    ListItemText,
    ListSubheader,
    Popover,
    Tooltip,
    Typography
} from '@mui/material';
import { appearanceAtom, AppearanceType } from '@states/appearance';
import { COOKIE_APPEARANCE, COOKIE_LOCALE } from '@utils/cookie';
import { getUserAvatar, getUserDisplayName } from '@utils/discord';
import { useAtom, useSetAtom } from 'jotai/index';
import NextLink from 'next/link';
import { setCookie } from 'nookies';
import React, { Fragment } from 'react';
import { PopoverListItemButton, PopoverListItemIcon, PopoverListItemLinkButton, PopoverListItemSwitch } from '../index';

const AppearancePopoverContent = ({ localization: { translations } }: UserPopoverProps) => {
    const setPopoverState = useSetAtom(userPopoverStateAtom);

    const [{ appearance }, setAppearance] = useAtom(appearanceAtom);

    const handleAppearanceChange = (type: AppearanceType) => {
        const isBrowserDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setAppearance({
            appearance: type,
            isDarkMode: type === 'dark' || (type === 'system' && isBrowserDarkScheme)
        });

        setCookie(
            null,
            COOKIE_APPEARANCE,
            type,
            {
                domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string,
                path: '/'
            }
        );

        setPopoverState(undefined);
    };

    return (
        <Fragment>
            <List>
                <PopoverListItemButton onClick={() => setPopoverState({ state: undefined })} dense>
                    <PopoverListItemIcon sx={{ minWidth: 'unset' }}>
                        <ArrowBackIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary={translations.design_and_appearance} />
                </PopoverListItemButton>
            </List>
            <Divider />
            <List>
                <PopoverListItemSwitch
                    checked={appearance === 'system'}
                    primary={translations.device_theme}
                    onClick={() => handleAppearanceChange('system')}
                    dense
                />
                <PopoverListItemSwitch
                    checked={appearance === 'light'}
                    primary={translations.light_theme}
                    onClick={() => handleAppearanceChange('light')}
                    dense
                />
                <PopoverListItemSwitch
                    checked={appearance === 'dark'}
                    primary={translations.dark_theme}
                    onClick={() => handleAppearanceChange('dark')}
                    dense
                />
            </List>
        </Fragment>
    );
};

const LocalePopoverContent = ({ localization: { locale, translations } }: UserPopoverProps) => {
    const setPopoverState = useSetAtom(userPopoverStateAtom);

    const handleLocaleChange = (type: LocaleType) => {
        setCookie(
            null,
            COOKIE_LOCALE,
            type,
            {
                domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string,
                path: '/'
            }
        );

        setPopoverState(undefined);

        window.location.reload();
    };

    return (
        <Fragment>
            <List>
                <PopoverListItemButton onClick={() => setPopoverState({ state: undefined })} dense>
                    <PopoverListItemIcon sx={{ minWidth: 'unset' }}>
                        <ArrowBackIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary={translations.language} />
                </PopoverListItemButton>
            </List>
            <Divider />
            <List>
                <PopoverListItemSwitch
                    checked={locale === 'ja'}
                    primary={translations.japanese}
                    onClick={() => handleLocaleChange('ja')}
                    dense
                />
                <PopoverListItemSwitch
                    checked={locale === 'en'}
                    primary={translations.english}
                    onClick={() => handleLocaleChange('en')}
                    dense
                />
            </List>
        </Fragment>
    );
};

export const DesktopUserPopover = ({ user, localization }: UserPopoverProps) => {
    const { translations } = localization;

    const [popoverState, setPopoverState] = useAtom(userPopoverStateAtom);
    const contentState = popoverState?.state;

    return (
        <Popover
            open={popoverState !== undefined}
            anchorEl={popoverState?.anchorEl}
            onClose={() => setPopoverState(undefined)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 300,
                        border: (theme) => `solid 1px ${theme.palette.divider}`,
                        boxShadow: (theme) => `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
                    }
                }
            }}
        >
            {contentState === 'appearance' && <AppearancePopoverContent user={user} localization={localization} />}
            {contentState === 'locale' && <LocalePopoverContent user={user} localization={localization} />}
            {!contentState && <Fragment>
                {user && <Fragment>
                    <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
                        <Avatar
                            src={getUserAvatar(user)}
                            alt=" "
                            sx={{ pointerEvents: 'none' }}
                        />
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                overflow: 'hidden'
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontSize="1.2rem"
                                lineHeight={1.2}
                                whiteSpace="nowrap"
                                textOverflow="ellipsis"
                                overflow="hidden"
                            >
                                {getUserDisplayName(user)}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontFamily="Renner"
                                lineHeight={1.1}
                                whiteSpace="nowrap"
                                textOverflow="ellipsis"
                                overflow="hidden"
                            >
                                {user.global_name ? `@${user.username}` : `#${user.discriminator}`}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}>
                            <Tooltip title={translations.user_settings}>
                                <IconButton
                                    component={NextLink}
                                    href="/dashboard/me"
                                    onClick={() => setPopoverState(undefined)}
                                >
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={translations.logout}>
                                <IconButton component={NextLink} href="https://account.lunaproject.jp/logout">
                                    <LogoutIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Divider />
                    <List>
                        <PopoverListItemLinkButton href="https://account.lunaproject.jp/" dense>
                            <PopoverListItemIcon>
                                <ManageAccountsIcon />
                            </PopoverListItemIcon>
                            <ListItemText primary={translations.manage_account} />
                            <OpenInNewIcon color="action" />
                        </PopoverListItemLinkButton>
                    </List>
                    <Divider />
                </Fragment>}
                <List subheader={user ? (
                    <ListSubheader
                        component="div"
                        sx={{
                            pt: 1,
                            pb: .5,
                            px: 1.5,
                            lineHeight: 'unset',
                            backgroundImage: (theme) => theme.palette.mode === 'dark' ? `linear-gradient(${alpha(
                                '#fff',
                                Number(getOverlayAlpha(8))
                            )}, ${alpha(
                                '#fff',
                                Number(getOverlayAlpha(8))
                            )})` : 'none'
                        }}
                    >
                        {translations.site_settings}
                    </ListSubheader>
                ) : undefined}>
                    <PopoverListItemButton onClick={() => setPopoverState({ state: 'appearance' })} dense>
                        <PopoverListItemIcon>
                            <BrushIcon />
                        </PopoverListItemIcon>
                        <ListItemText primary={translations.design_and_appearance} />
                        <KeyboardArrowRightIcon color="action" />
                    </PopoverListItemButton>
                    <PopoverListItemButton onClick={() => setPopoverState({ state: 'locale' })} dense>
                        <PopoverListItemIcon>
                            <TranslateIcon />
                        </PopoverListItemIcon>
                        <ListItemText primary={translations.language} />
                        <KeyboardArrowRightIcon color="action" />
                    </PopoverListItemButton>
                </List>
            </Fragment>}
        </Popover>
    );
};
