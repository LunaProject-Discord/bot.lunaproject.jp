'use client';

import { NavigationAppBar, NavigationDrawerToolbar } from '@app/_navigation';
import { GuildSelect } from '@app/dashboard/[id]/components';
import { CommandBoxIcon } from '@components/icons';
import {
    NavigationDrawer,
    NavigationDrawerContent,
    NavigationDrawerGroup,
    NavigationDrawerItem,
    NavigationRoot
} from '@components/navigation';
import { GuildFlags, UserFlags } from '@interfaces/bot';
import { DataGuild, RedisGuild } from '@interfaces/redis';
import { UserViewProps } from '@interfaces/view';
import { RouteLink } from '@lunaproject/web-core/dist/components/Link';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import {
    ArrowBackOutlined,
    DirectionsRunOutlined,
    DriveFileRenameOutlineOutlined,
    EmojiEventsOutlined,
    FormatQuoteOutlined,
    HomeOutlined,
    MusicNoteOutlined,
    NotificationsOutlined,
    PersonAddOutlined,
    PersonRemoveOutlined,
    PollOutlined,
    RecordVoiceOverOutlined,
    ScheduleOutlined,
    SecurityOutlined,
    SellOutlined,
    TextSnippetOutlined,
    TranslateOutlined
} from '@mui/icons-material';
import { Avatar, Box, Chip, Theme, Typography, useMediaQuery } from '@mui/material';
import { getGuildIcon } from '@utils/cdn';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';

interface NavigationProps extends UserViewProps {
    userManager: boolean;
    userFlags: UserFlags | undefined;
    guild: RedisGuild | DataGuild;
    guildFlags: GuildFlags;
    guilds: OAuthGuild[];
    mutualGuilds: string[];
}

export const Navigation = (
    {
        user,
        userManager,
        userFlags,
        guild,
        guildFlags,
        guilds,
        mutualGuilds,
        localization
    }: NavigationProps
) => {
    const { translations } = localization;

    const router = useRouter();

    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const [open, setOpen] = useState(false);

    const prefix = `/dashboard/${guild.id}`;
    return (
        <Fragment>
            {!isDesktop && <NavigationAppBar
                open={open}
                setOpen={setOpen}
                user={user}
                flags={userFlags}
                localization={localization}
            />}
            <NavigationRoot>
                <NavigationDrawer
                    open={open}
                    onClose={() => setOpen(false)}
                    variant={isDesktop ? 'permanent' : 'temporary'}
                >
                    {!isDesktop ? <Fragment>
                        <NavigationDrawerToolbar open={open} setOpen={setOpen} />
                        <RouteLink
                            href="/dashboard"
                            underline="none"
                            color="text.secondary"
                            sx={{
                                mx: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <ArrowBackOutlined fontSize="small" />
                            {translations.back_to_select_guild}
                        </RouteLink>
                    </Fragment> : <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5">{translations.dashboard}</Typography>
                        <Typography color="text.secondary">{translations.guild_settings}</Typography>
                    </Box>}
                    <Box sx={{ px: { xs: 1, md: 0 } }}>
                        {(userManager && !mutualGuilds.includes(guild.id)) ? <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Avatar
                                src={getGuildIcon(guild)}
                                alt=" "
                                sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                            />
                            <Typography>{guild.name}</Typography>
                        </Box> : <GuildSelect
                            value={guild.id}
                            setValue={(value) => router.push(`/dashboard/${value}`)}
                            guilds={guilds}
                            mutualGuilds={mutualGuilds}
                        />}
                    </Box>
                    <NavigationDrawerContent>
                        <NavigationDrawerGroup>
                            <NavigationDrawerItem
                                href={prefix}
                                predicate={(pathname) => pathname === prefix}
                                icon={<HomeOutlined />}
                                primary={translations.home}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/notifications`}
                                icon={<NotificationsOutlined />}
                                primary={translations.notifications}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                        <NavigationDrawerGroup label={translations.settings_basic}>
                            <NavigationDrawerItem
                                href={`${prefix}/prefix-and-nickname`}
                                icon={<DriveFileRenameOutlineOutlined />}
                                primary={translations.prefix_and_nickname}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/time-and-language`}
                                icon={<ScheduleOutlined />}
                                primary={translations.time_and_language}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/commands`}
                                icon={<CommandBoxIcon />}
                                primary={translations.commands}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                        <NavigationDrawerGroup label={translations.settings_moderation_and_management}>
                            {guildFlags.tester && <NavigationDrawerItem
                                href={`${prefix}/automod`}
                                icon={<SecurityOutlined />}
                                primary={
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {translations.automod}
                                        <Chip
                                            label="🚧"
                                            variant="rounded"
                                            color="warning"
                                            size="small"
                                            sx={{ height: 20, ml: 'auto' }}
                                        />
                                    </Box>
                                }
                                open={open}
                                setOpen={setOpen}
                            />}
                            <NavigationDrawerItem
                                href={`${prefix}/check-role-permissions`}
                                icon={<SellOutlined />}
                                primary={translations.role_permissions}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                        <NavigationDrawerGroup label={translations.settings_features_and_options}>
                            <NavigationDrawerItem
                                href={`${prefix}/welcome`}
                                icon={<PersonAddOutlined />}
                                primary={translations.welcome_message}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/goodbye`}
                                icon={<PersonRemoveOutlined />}
                                primary={translations.goodbye_message}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/activity`}
                                icon={<DirectionsRunOutlined />}
                                primary={translations.activity}
                                open={open}
                                setOpen={setOpen}
                            />
                            {guildFlags.tester && <NavigationDrawerItem
                                href={`${prefix}/role-panels`}
                                icon={<SellOutlined />}
                                primary={
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {translations.role_panels}
                                        <Chip
                                            label="🚧"
                                            variant="rounded"
                                            color="warning"
                                            size="small"
                                            sx={{ height: 20, ml: 'auto' }}
                                        />
                                    </Box>
                                }
                                open={open}
                                setOpen={setOpen}
                            />}
                            <NavigationDrawerItem
                                href={`${prefix}/level`}
                                icon={<EmojiEventsOutlined />}
                                primary={translations.level}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/translate`}
                                icon={<TranslateOutlined />}
                                primary={translations.translate}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/vote`}
                                icon={<PollOutlined />}
                                primary={translations.vote}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/quote`}
                                icon={<FormatQuoteOutlined />}
                                primary={translations.quote}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/music`}
                                icon={<MusicNoteOutlined />}
                                primary={translations.music}
                                open={open}
                                setOpen={setOpen}
                            />
                            {guildFlags.tester && <NavigationDrawerItem
                                href={`${prefix}/text-to-speech`}
                                icon={<RecordVoiceOverOutlined />}
                                primary={
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        {translations.text_to_speech}
                                        <Chip
                                            label="🚧"
                                            variant="rounded"
                                            color="warning"
                                            size="small"
                                            sx={{ height: 20, ml: 'auto' }}
                                        />
                                    </Box>
                                }
                                open={open}
                                setOpen={setOpen}
                            />}
                            <NavigationDrawerItem
                                href={`${prefix}/logging`}
                                icon={<TextSnippetOutlined />}
                                primary={translations.logging}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                    </NavigationDrawerContent>
                </NavigationDrawer>
            </NavigationRoot>
        </Fragment>
    );
};
