'use client';

import { TemporaryDrawer } from '@lunaproject-discord/web-core/dist/components/Drawer';
import {
    AnalyticsOutlined,
    HomeOutlined,
    LeaderboardOutlined,
    LoginOutlined,
    MenuOutlined,
    SettingsOutlined,
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
    Tooltip,
    useTheme
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Fragment, ReactNode, useState } from 'react';
import { AppBar, Toolbar } from '../../components/appbar';
import { getUserAvatar } from '../../utils/discord';
import { NavigationItemProps, NavigationRootProps } from './index';

const MobileNavigationGroup = styled(List)(({ theme }) => ({
    padding: theme.spacing(1)
}));

interface MobileNavigationItemProps extends NavigationItemProps {
    primary?: ReactNode;
    secondary?: ReactNode;
}

const MobileNavigationItem = ({ href, icon, primary, secondary }: MobileNavigationItemProps) => {
    const pathname = usePathname();
    const loweredPathname = pathname.toLowerCase();
    const loweredHref = href.toLowerCase();
    const isMatch = href === '/' ? loweredPathname === loweredHref : loweredPathname.startsWith(loweredHref);

    const { palette: { mode } } = useTheme();
    const color = isMatch ? 'primary.main' : 'action.active';

    return (
        <ListItemButton
            component={NextLink}
            href={href}
            selected={isMatch}
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

export const MobileNavigation = ({ openPopover, user, localization: { translations } }: NavigationRootProps) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => setOpen((prevOpen) => !prevOpen);

    return (
        <Fragment>
            <AppBar>
                <Toolbar>
                    <IconButton onClick={handleDrawerToggle} color="inherit">
                        <MenuOutlined />
                    </IconButton>
                    <Image src="/logo/yudzuki.svg" alt="" width={158} height={40} />
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user ? <Tooltip title={user.username} placement="bottom">
                            <IconButton
                                onClick={({ currentTarget }) => openPopover(currentTarget, 'user')}
                                sx={{ p: .5 }}
                            >
                                <Avatar
                                    src={getUserAvatar(user)}
                                    sx={{ width: 32, height: 32, pointerEvents: 'none' }}
                                />
                            </IconButton>
                        </Tooltip> : <Fragment>
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
                        </Fragment>}
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
                    <Image src="/logo/yudzuki.svg" alt="" width={158} height={40} />
                </Toolbar>
                <MobileNavigationGroup>
                    <MobileNavigationItem
                        href="/"
                        icon={<HomeOutlined />}
                        primary={translations.home}
                    />
                    <MobileNavigationItem
                        href="/status"
                        icon={<AnalyticsOutlined />}
                        primary={translations.status}
                    />
                    <MobileNavigationItem
                        href="/leaderboard"
                        icon={<LeaderboardOutlined />}
                        primary={translations.leaderboard}
                    />
                    <MobileNavigationItem
                        href="/dashboard"
                        icon={<SettingsOutlined />}
                        primary={translations.guild_settings}
                    />
                </MobileNavigationGroup>
            </TemporaryDrawer>
        </Fragment>
    );
};
