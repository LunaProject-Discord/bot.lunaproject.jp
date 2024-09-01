'use client';

import { ServicesPopover, UserPopover } from '@/app/_popovers';
import {
    AnalyticsIcon,
    AppsIcon,
    HomeIcon,
    LeaderboardIcon,
    LoginIcon,
    MenuIcon,
    MonitoringIcon,
    SettingsIcon,
    TuneIcon
} from '@/components/icons';
import { UserFlags } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { appearanceClasses } from '@/states/appearance';
import { navigationAtom } from '@/states/navigation';
import { popoverAtom } from '@/states/popover';
import { getUserAvatar, getUserDisplayName } from '@/utils/discord';
import { RouteLink } from '@lunaproject/web-core/dist/components/Link';
import {
    NavigationAppBar as RootNavigationAppBar,
    NavigationDrawer as RootNavigationDrawer,
    NavigationDrawerGroup,
    NavigationDrawerItem,
    NavigationDrawerProps as RootNavigationDrawerProps,
    NavigationToolbar,
    NavigationToolbarItem
} from '@lunaproject/web-core/dist/components/Navigation';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar, Box, Divider, IconButton, Tooltip, useScrollTrigger } from '@mui/material';
import clsx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import Image from 'next/image';
import NextLink from 'next/link';
import React, { Fragment, MouseEvent, useState } from 'react';

export type RootNavigationProps = NavigationProps & RootNavigationDrawerProps;

export const NavigationAppBar = ({ setOpen, user, flags, localization: { translations } }: RootNavigationProps) => {
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

    const setPopoverState = useSetAtom(popoverAtom);
    const { disableElevation } = useAtomValue(navigationAtom);

    const handleDrawerToggle = () => setOpen((prevState) => !prevState);

    const handleServicesPopoverOpenButtonClick = (e: MouseEvent<HTMLButtonElement>) => setPopoverState({
        type: 'services',
        anchorEl: e.currentTarget
    });

    const handleUserPopoverOpenButtonClick = (e: MouseEvent<HTMLButtonElement>) => setPopoverState({
        type: 'user',
        anchorEl: e.currentTarget,
        state: undefined
    });

    return (
        <RootNavigationAppBar
            sx={{
                boxShadow: (theme) => trigger && !disableElevation ? `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)` : 'none'
            }}
        >
            <NavigationToolbar>
                <IconButton onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
                    <MenuIcon />
                </IconButton>
                <RouteLink
                    href="/"
                    sx={(theme) => ({
                        display: 'flex',
                        placeItems: 'center',
                        placeContent: 'center',
                        [`& .${appearanceClasses.root}`]: {
                            display: 'none',
                            ...theme.applyStyles('light', {
                                [`&.${appearanceClasses.light}`]: {
                                    display: 'block'
                                }
                            }),
                            ...theme.applyStyles('dark', {
                                [`&.${appearanceClasses.dark}`]: {
                                    display: 'block'
                                }
                            })
                        }
                    })}
                >
                    <Image
                        src="/yudzuki/logo_light.svg"
                        alt=""
                        width={142}
                        height={48}
                        quality={100}
                        className={clsx(appearanceClasses.root, appearanceClasses.light)}
                    />
                    <Image
                        src="/yudzuki/logo_dark.svg"
                        alt=""
                        width={142}
                        height={48}
                        quality={100}
                        className={clsx(appearanceClasses.root, appearanceClasses.dark)}
                    />
                </RouteLink>
                <Box sx={{ ml: 2, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                    <NavigationToolbarItem href="/status">
                        {translations.status}
                    </NavigationToolbarItem>
                    <NavigationToolbarItem href="/leaderboard">
                        {translations.leaderboard}
                    </NavigationToolbarItem>
                    <NavigationToolbarItem
                        href="/dashboard"
                        predicate={(pathname, href) => pathname !== undefined && (pathname.startsWith(href) && !pathname.startsWith('/dashboard/me'))}
                    >
                        {translations.guild_settings}
                    </NavigationToolbarItem>
                    {flags?.manager && <Fragment>
                        <Divider orientation="vertical" flexItem sx={{ m: 1 }} />
                        <NavigationToolbarItem href="/statistics">
                            {translations.statistics}
                        </NavigationToolbarItem>
                    </Fragment>}
                </Box>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={translations.lunaproject_services} placement="bottom">
                        <IconButton onClick={handleServicesPopoverOpenButtonClick}>
                            <AppsIcon />
                        </IconButton>
                    </Tooltip>
                    {user ? <Tooltip title={getUserDisplayName(user)} placement="bottom">
                        <IconButton onClick={handleUserPopoverOpenButtonClick} sx={{ p: .5 }}>
                            <Avatar
                                src={getUserAvatar(user)}
                                sx={{ width: 32, height: 32, pointerEvents: 'none' }}
                            />
                        </IconButton>
                    </Tooltip> : <Fragment>
                        <Tooltip title={translations.site_settings} placement="bottom">
                            <IconButton onClick={handleUserPopoverOpenButtonClick}>
                                <TuneIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.login} placement="bottom">
                            <IconButton
                                component={NextLink}
                                href={`https://account.lunaproject.jp/login${typeof window !== 'undefined' && window.location.href ? `?redirect=${encodeURIComponent(window.location.href)}` : ''}`}
                            >
                                <LoginIcon />
                            </IconButton>
                        </Tooltip>
                    </Fragment>}
                </Box>
            </NavigationToolbar>
        </RootNavigationAppBar>
    );
};

export const NavigationDrawerToolbar = ({ setOpen }: RootNavigationDrawerProps) => {
    const handleDrawerToggle = () => setOpen((prevState) => !prevState);

    return (
        <NavigationToolbar
            sx={(theme) => ({
                px: { md: `${theme.spacing(1)} !important` },
                position: 'sticky',
                top: 0,
                bgcolor: 'background.default',
                zIndex: 1
            })}
        >
            <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
            </IconButton>
            <RouteLink
                href="/"
                sx={(theme) => ({
                    display: 'flex',
                    placeItems: 'center',
                    placeContent: 'center',
                    [`& .${appearanceClasses.root}`]: {
                        display: 'none',
                        ...theme.applyStyles('light', {
                            [`&.${appearanceClasses.light}`]: {
                                display: 'block'
                            }
                        }),
                        ...theme.applyStyles('dark', {
                            [`&.${appearanceClasses.dark}`]: {
                                display: 'block'
                            }
                        })
                    }
                })}
            >
                <Image
                    src="/yudzuki/logo_light.svg"
                    alt=""
                    width={142}
                    height={48}
                    quality={100}
                    className={clsx(appearanceClasses.root, appearanceClasses.light)}
                />
                <Image
                    src="/yudzuki/logo_dark.svg"
                    alt=""
                    width={142}
                    height={48}
                    quality={100}
                    className={clsx(appearanceClasses.root, appearanceClasses.dark)}
                />
            </RouteLink>
        </NavigationToolbar>
    );
};

export const NavigationDrawer = ({ open, setOpen, flags, localization: { translations } }: RootNavigationProps) => {
    return (
        <RootNavigationDrawer open={open} onClose={() => setOpen(false)} variant="temporary">
            <NavigationDrawerToolbar open={open} setOpen={setOpen} />
            <NavigationDrawerGroup sx={{ px: { md: 1 } }}>
                <NavigationDrawerItem
                    href="/"
                    icon={<HomeIcon />}
                    primary={translations.home}
                    open={open}
                    setOpen={setOpen}
                />
                <NavigationDrawerItem
                    href="/status"
                    icon={<AnalyticsIcon />}
                    primary={translations.status}
                    open={open}
                    setOpen={setOpen}
                />
                <NavigationDrawerItem
                    href="/leaderboard"
                    icon={<LeaderboardIcon />}
                    primary={translations.leaderboard}
                    open={open}
                    setOpen={setOpen}
                />
                <NavigationDrawerItem
                    href="/dashboard"
                    predicate={(pathname, href) => pathname !== undefined && (pathname.startsWith(href) && !pathname.startsWith('/dashboard/me'))}
                    icon={<SettingsIcon />}
                    primary={translations.guild_settings}
                    open={open}
                    setOpen={setOpen}
                />
            </NavigationDrawerGroup>
            {flags?.manager && <Fragment>
                <Divider flexItem sx={{ mx: 2 }} />
                <NavigationDrawerGroup sx={{ px: { md: 1 } }}>
                    <NavigationDrawerItem
                        href="/statistics"
                        icon={<MonitoringIcon />}
                        primary={translations.statistics}
                        open={open}
                        setOpen={setOpen}
                    />
                </NavigationDrawerGroup>
            </Fragment>}
        </RootNavigationDrawer>
    );
};

export interface NavigationProps extends LocalizationProps {
    user: OAuthUser | undefined;
    flags: UserFlags | undefined;
}

export const Navigation = ({ user, flags, localization }: NavigationProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <NavigationAppBar open={open} setOpen={setOpen} user={user} flags={flags} localization={localization} />
            <NavigationDrawer open={open} setOpen={setOpen} user={user} flags={flags} localization={localization} />

            <ServicesPopover localization={localization} />
            <UserPopover user={user} localization={localization} />
        </Fragment>
    );
};
