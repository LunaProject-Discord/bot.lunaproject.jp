'use client';

import { defaultPredicate } from '@app/_navigation/utils';
import {
    AnalyticsOutlined,
    HomeOutlined,
    LeaderboardOutlined,
    LoginOutlined,
    SettingsOutlined,
    TuneOutlined
} from '@mui/icons-material';
import { alpha, Avatar, Divider, IconButton, styled, Tooltip } from '@mui/material';
import { getUserAvatar, getUserDisplayName } from '@utils/discord';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Fragment, ReactNode } from 'react';
import Icon from '../icon.svg';
import { NavigationItemProps, NavigationRootProps } from './index';

const DesktopNavigationRoot = styled('nav')(({ theme }) => ({
    width: 56,
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `solid 1px ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));

const DesktopNavigationGroup = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

interface DesktopNavigationItemProps extends NavigationItemProps {
    label?: ReactNode;
}

const DesktopNavigationItem = ({ href, predicate, icon, label }: DesktopNavigationItemProps) => {
    const pathname = usePathname();
    const loweredPathname = pathname.toLowerCase();
    const loweredHref = href.toLowerCase();
    const isMatch = (predicate ? predicate : defaultPredicate)(loweredPathname, loweredHref);

    return (
        <Tooltip title={label} placement="right">
            <IconButton
                component={NextLink}
                href={href}
                sx={isMatch ? {
                    color: 'primary.main',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
                } : undefined}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
};

export const DesktopNavigation = ({ openPopover, user, localization: { translations } }: NavigationRootProps) => (
    <DesktopNavigationRoot>
        <DesktopNavigationGroup>
            <IconButton disabled>
                <Image src={Icon} alt="" width={24} height={24} />
            </IconButton>
        </DesktopNavigationGroup>
        <Divider flexItem sx={{ mx: 1 }} />
        <DesktopNavigationGroup sx={{ height: '100%' }}>
            <DesktopNavigationItem
                href="/"
                icon={<HomeOutlined />}
                label={translations.home}
            />
            <DesktopNavigationItem
                href="/status"
                icon={<AnalyticsOutlined />}
                label={translations.status}
            />
            <DesktopNavigationItem
                href="/leaderboard"
                icon={<LeaderboardOutlined />}
                label={translations.leaderboard}
            />
            <DesktopNavigationItem
                href="/dashboard"
                predicate={(pathname, href) => pathname.startsWith(href) && !pathname.startsWith('/dashboard/me')}
                icon={<SettingsOutlined />}
                label={translations.guild_settings}
            />
        </DesktopNavigationGroup>
        <Divider flexItem sx={{ mx: 1 }} />
        <DesktopNavigationGroup>
            {user ? <Tooltip title={getUserDisplayName(user)} placement="right">
                <IconButton onClick={({ currentTarget }) => openPopover(currentTarget, 'user')} sx={{ p: .5 }}>
                    <Avatar
                        src={getUserAvatar(user)}
                        alt=" "
                        sx={{ width: 32, height: 32, pointerEvents: 'none' }}
                    />
                </IconButton>
            </Tooltip> : <Fragment>
                <Tooltip title={translations.site_settings} placement="right">
                    <IconButton onClick={({ currentTarget }) => openPopover(currentTarget, 'user')}>
                        <TuneOutlined />
                    </IconButton>
                </Tooltip>
                <Tooltip title={translations.login} placement="right">
                    <IconButton
                        component={NextLink}
                        href={`https://accounts.lunaproject.jp/login${typeof window !== 'undefined' && window.location.href ? `?redirect=${encodeURIComponent(window.location.href)}` : ''}`}
                    >
                        <LoginOutlined />
                    </IconButton>
                </Tooltip>
            </Fragment>}
        </DesktopNavigationGroup>
    </DesktopNavigationRoot>
);
