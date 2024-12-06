'use client';

import { BrandingFontFamily } from '@/app/theme';
import { AddIcon, OpenInNewIcon } from '@/components/icons';
import { RedisMember } from '@/interfaces/redis';
import { GuildConfigurationViewProps, GuildViewProps } from '@/interfaces/view';
import { navigationAtom } from '@/states/navigation';
import { getGuildIcon } from '@/utils/cdn';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { NavigationAppBarId } from '@lunaproject/web-core/dist/components/Navigation';
import { Avatar, Box, Link, Slide, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useSetAtom } from 'jotai';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Sticky, { Status } from 'react-stickynode';

interface LayoutHeaderProps extends GuildViewProps {
    member: RedisMember | undefined;
}

export const LayoutHeader = ({ guild, member, localization }: LayoutHeaderProps) => {
    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
                sx={{
                    aspectRatio: '6 / 1',
                    width: '100%',
                    minHeight: (theme) => theme.spacing(12),
                    // background: 'linear-gradient(90deg, #ffd54e 0%, #ffc636 20%, #ff9147 40%, #ff5b58 60%, #ff3961 80%, #ff005e 100%)',
                    background: 'linear-gradient(125deg, #bbc1df 0%, #a8aecf 25%, #959ac0 50%, #767c9e 75%, #6b7195 100%)',
                    // backgroundImage: 'url(/thumbnail.png)',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    borderRadius: 3
                }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                    src={getGuildIcon(guild, 256)}
                    sx={(theme) => ({
                        width: {
                            xs: theme.spacing(8),
                            md: theme.spacing(20)
                        },
                        height: {
                            xs: theme.spacing(8),
                            md: theme.spacing(20)
                        },
                        pointerEvents: 'none'
                    })}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 2 } }}>
                    <Typography variant="h1" fontFamily={BrandingFontFamily} fontWeight={600}>
                        {guild.name}
                    </Typography>
                    <Button
                        component={Link}
                        href={member ? `https://discord.com/channels/${guild.id}` : `/guilds/${guild.id}/invite`}
                        target="_blank"
                        disableElevation
                        variant={member ? 'outlined' : 'contained'}
                        corners="extended"
                        size="large"
                        startIcon={member ? <OpenInNewIcon /> : <AddIcon />}
                        sx={{ width: 'fit-content' }}
                    >
                        {member ? 'チャンネルを見る' : 'サーバーに参加'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

interface LayoutNavigationProps extends GuildConfigurationViewProps {
    leaderboardAccessible: boolean;
    dashboardAccessible: boolean;
}

export const LayoutNavigation = (
    {
        guild,
        configuration,
        leaderboardAccessible,
        dashboardAccessible,
        localization
    }: LayoutNavigationProps
) => {
    const { translations } = localization;

    const pathname = usePathname();
    const loweredPathname = pathname.toLowerCase();

    const theme = useTheme();
    const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    const containerRef = useRef<HTMLDivElement | null>(null);

    const setNavigation = useSetAtom(navigationAtom);
    const [trigger, setTrigger] = useState(false);

    const handleStickyStateChange = ({ status }: Status) => {
        const isSticky = status === Sticky.STATUS_FIXED;
        setTrigger(isSticky);
        setNavigation({ disableElevation: isSticky });
    };

    useEffect(() => {
        return () => setNavigation({ disableElevation: false });
    }, [setNavigation]);

    const prefix = `/guilds/${guild.id}`;
    return (
        <Box
            sx={(theme) => ({
                '& .sticky-outer-wrapper.active .sticky-inner-wrapper': {
                    width: '100% !important',
                    left: 0,
                    transition: theme.transitions.create('box-shadow'),
                    boxShadow: trigger ? `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgb(0 0 0 / .15)` : 'none'
                }
            })}
        >
            <Sticky
                top={`#${NavigationAppBarId}`}
                innerZ={2}
                innerActiveClass="mui-fixed"
                onStateChange={handleStickyStateChange}
            >
                <Box
                    ref={containerRef}
                    sx={{
                        maxWidth: (theme) => theme.breakpoints.values.xl,
                        margin: '0 auto',
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        bgcolor: 'background.paper'
                    }}
                >
                    {isSmall && <Slide
                        in={trigger}
                        direction="down"
                        container={containerRef.current}
                        mountOnEnter
                        unmountOnExit
                        timeout={{ enter: theme.transitions.duration.enteringScreen, exit: 0 }}
                    >
                        <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 1 }}>
                            <Avatar
                                src={getGuildIcon(guild)}
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
                                <Typography fontFamily={BrandingFontFamily} fontWeight={600}>{guild.name}</Typography>
                            </Box>
                        </Box>
                    </Slide>}
                    <Tabs
                        value={loweredPathname}
                        variant="scrollable"
                        sx={{
                            width: '100%',
                            borderBottom: trigger ? 'none' : undefined
                        }}
                    >
                        <Tab
                            component={NextLink}
                            label={translations.home}
                            href={prefix}
                            value={prefix}
                        />
                        <Tab
                            component={NextLink}
                            label="投稿"
                            href={`${prefix}/articles`}
                            value={`${prefix}/articles`}
                        />
                        <Tab
                            component={NextLink}
                            label="プラン"
                            href={`${prefix}/plans`}
                            value={`${prefix}/plans`}
                        />
                        {leaderboardAccessible && <Tab
                            component={NextLink}
                            label={translations.leaderboard}
                            href={`${prefix}/leaderboard`}
                            value={`${prefix}/leaderboard`}
                        />}
                        {dashboardAccessible && <Tab
                            component={NextLink}
                            label={translations.dashboard}
                            href={`/dashboard/${guild.id}`}
                            value={`/dashboard/${guild.id}`}
                            sx={{ ml: 'auto' }}
                        />}
                    </Tabs>
                </Box>
            </Sticky>
        </Box>
    );
};
