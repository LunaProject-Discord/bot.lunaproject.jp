'use client';

import { defaultPredicate } from '@app/_navigation/utils';
import { AppBar, Toolbar } from '@components/appbar';
import { TemporaryDrawer } from '@lunaproject-discord/web-core/dist/components/Drawer';
import { RouteLink } from '@lunaproject-discord/web-core/dist/components/Link';
import {
    AnalyticsOutlined,
    HomeOutlined,
    LeaderboardOutlined,
    LoginOutlined,
    MenuOutlined,
    SettingsOutlined,
    ShowChartOutlined,
    TuneOutlined
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    styled,
    Tooltip
} from '@mui/material';
import { getUserAvatar, getUserDisplayName } from '@utils/discord';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { Dispatch, Fragment, MouseEvent, ReactNode, SetStateAction, useState } from 'react';
import { NavigationItemProps, NavigationRootProps } from './index';

const MobileNavigationGroup = styled(List)(({ theme }) => ({
    padding: theme.spacing(1)
}));

interface MobileNavigationItemProps extends NavigationItemProps {
    primary?: ReactNode;
    secondary?: ReactNode;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileNavigationItem = ({ href, predicate, icon, primary, secondary, setOpen }: MobileNavigationItemProps) => {
    const router = useRouter();

    const pathname = usePathname();
    const loweredPathname = pathname.toLowerCase();
    const loweredHref = href.toLowerCase();
    const isMatch = (predicate ? predicate : defaultPredicate)(loweredPathname, loweredHref);

    const color = isMatch ? 'primary.main' : 'action.active';

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.push(href);
        setOpen(false);
    };

    return (
        <ListItemButton
            component={NextLink}
            href={href}
            selected={isMatch}
            onClick={handleClick}
            sx={{ px: 1.5, py: 1, gap: 1.5, borderRadius: 1 }}
        >
            <ListItemIcon sx={{ minWidth: 24, color }}>{icon}</ListItemIcon>
            <ListItemText
                primary={primary}
                primaryTypographyProps={{ color }}
                secondary={secondary}
                secondaryTypographyProps={{ color }}
            />
        </ListItemButton>
    );
};

const MobileNavigationListDivider = styled(Divider)(({ theme }) => ({
    margin: theme.spacing(1, 3, 1, 0)
}));

const MobileNavigationListSubHeader = styled(ListSubheader)(({ theme }) => ({
    padding: theme.spacing(1, 3),
    lineHeight: 'unset'
}));

export const MobileNavigationAppBarMenu = (
    {
        openPopover,
        user,
        localization: { translations }
    }: Omit<NavigationRootProps, 'flags'>
) => user ? (
    <Tooltip title={getUserDisplayName(user)} placement="bottom">
        <IconButton
            onClick={({ currentTarget }) => openPopover(currentTarget, 'user')}
            sx={{ p: .5 }}
        >
            <Avatar
                src={getUserAvatar(user)}
                sx={{ width: 32, height: 32, pointerEvents: 'none' }}
            />
        </IconButton>
    </Tooltip>
) : (
    <Fragment>
        <Tooltip title={translations.site_settings} placement="bottom">
            <IconButton onClick={({ currentTarget }) => openPopover(currentTarget, 'user')}>
                <TuneOutlined />
            </IconButton>
        </Tooltip>
        <Tooltip title={translations.login} placement="bottom">
            <IconButton
                component={NextLink}
                href={`https://accounts.lunaproject.jp/login${typeof window !== 'undefined' && window.location.href ? `?redirect=${encodeURIComponent(window.location.href)}` : ''}`}
            >
                <LoginOutlined />
            </IconButton>
        </Tooltip>
    </Fragment>
);

export const MobileNavigation = ({ openPopover, closePopover, user, flags, localization }: NavigationRootProps) => {
    const { translations } = localization;

    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => setOpen((prevState) => !prevState);

    return (
        <Fragment>
            <AppBar>
                <Toolbar>
                    <IconButton onClick={handleDrawerToggle} color="inherit">
                        <MenuOutlined />
                    </IconButton>
                    <RouteLink href="/">
                        <Image src="/logo/yudzuki.svg" alt="" width={158} height={40} />
                    </RouteLink>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MobileNavigationAppBarMenu
                            openPopover={openPopover}
                            closePopover={closePopover}
                            user={user}
                            localization={localization}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <TemporaryDrawer
                variant="temporary"
                open={open}
                onClose={handleDrawerToggle}
            >
                <Toolbar>
                    <IconButton onClick={handleDrawerToggle} color="inherit">
                        <MenuOutlined />
                    </IconButton>
                    <RouteLink href="/">
                        <Image src="/logo/yudzuki.svg" alt="" width={158} height={40} />
                    </RouteLink>
                </Toolbar>
                <MobileNavigationGroup>
                    <MobileNavigationItem
                        href="/"
                        icon={<HomeOutlined />}
                        primary={translations.home}
                        open={open}
                        setOpen={setOpen}
                    />
                    <MobileNavigationItem
                        href="/status"
                        icon={<AnalyticsOutlined />}
                        primary={translations.status}
                        open={open}
                        setOpen={setOpen}
                    />
                    <MobileNavigationItem
                        href="/leaderboard"
                        icon={<LeaderboardOutlined />}
                        primary={translations.leaderboard}
                        open={open}
                        setOpen={setOpen}
                    />
                    <MobileNavigationItem
                        href="/dashboard"
                        predicate={(pathname, href) => pathname.startsWith(href) && !pathname.startsWith('/dashboard/me')}
                        icon={<SettingsOutlined />}
                        primary={translations.guild_settings}
                        open={open}
                        setOpen={setOpen}
                    />
                </MobileNavigationGroup>
                {flags?.manager && <Fragment>
                    <Divider flexItem sx={{ mx: 2 }} />
                    <MobileNavigationGroup>
                        <MobileNavigationItem
                            href="/statistics"
                            icon={<ShowChartOutlined />}
                            primary={translations.statistics}
                            open={open}
                            setOpen={setOpen}
                        />
                    </MobileNavigationGroup>
                </Fragment>}
            </TemporaryDrawer>
        </Fragment>
    );
};
