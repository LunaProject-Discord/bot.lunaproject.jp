'use client';

import { BrandingFontFamily } from '@app/theme';
import { AddIcon, OpenInNewIcon } from '@components/icons';
import { RedisMember } from '@interfaces/redis';
import { GuildConfigurationViewProps, GuildViewProps } from '@interfaces/view';
import { Avatar, Box, Button, Link, Tab, Tabs, Typography } from '@mui/material';
import { getGuildIcon } from '@utils/cdn';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface LayoutHeaderProps extends GuildViewProps {
    member: RedisMember | undefined;
}

export const LayoutHeader = ({ guild, member, localization }: LayoutHeaderProps) => {
    return (
        <Box sx={{ p: 2, pb: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
                sx={{
                    aspectRatio: '6 / 1',
                    width: '100%',
                    minHeight: (theme) => theme.spacing(12),
                    backgroundImage: 'url(/thumbnail.png)',
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
                    <Typography variant="h4" fontFamily={BrandingFontFamily} fontSize="2.25rem" fontWeight={600}>
                        {guild.name}
                    </Typography>
                    <Button
                        component={Link}
                        href={member ? `https://discord.com/channels/${guild.id}` : `/guilds/${guild.id}/invite`}
                        target="_blank"
                        disableElevation
                        variant={member ? 'outlined' : 'contained'}
                        size="large"
                        startIcon={member ? <OpenInNewIcon /> : <AddIcon />}
                        sx={{
                            width: 'fit-content',
                            borderRadius: '10000px'
                        }}
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

    const prefix = `/guilds/${guild.id}`;
    return (
        <Box
            sx={(theme) => ({
                px: 2,
                pt: 2,
                position: 'sticky',
                top: { xs: theme.spacing(7), sm: theme.spacing(8) },
                zIndex: 2,
                bgcolor: 'background.paper'
            })}
        >
            <Tabs value={loweredPathname} variant="scrollable">
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
    );
};
