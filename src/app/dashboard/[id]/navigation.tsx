'use client';

import { NavigationAppBar, NavigationDrawerToolbar } from '@/app/_navigation';
import {
    ArrowBackIcon,
    CategoryIcon,
    CommandBoxIcon,
    DirectionsRunIcon,
    DocsIcon,
    EmojiEventsIcon,
    FormatQuoteIcon,
    HomeIcon,
    LabelIcon,
    MonitoringIcon,
    MusicNoteIcon,
    NotificationsIcon,
    PersonAddIcon,
    PersonRemoveIcon,
    RecordVoiceOverIcon,
    ScheduleIcon,
    SecurityIcon,
    TagIcon,
    TextSnippetIcon,
    TranslateIcon
} from '@/components/icons';
import { GuildSelect } from '@/components/select';
import { GuildConfiguration, GuildFlags, UserFlags } from '@/interfaces/bot';
import { DataGuild, RedisGuild } from '@/interfaces/redis';
import { UserViewProps } from '@/interfaces/view';
import { getGuildIcon } from '@/utils/cdn';
import { RouteLink } from '@lunaproject/web-core/dist/components/Link';
import {
    NavigationDrawer,
    NavigationDrawerContent,
    NavigationDrawerGroup,
    NavigationDrawerItem,
    NavigationDrawerItemWithEnabledStatus,
    NavigationRoot
} from '@lunaproject/web-core/dist/components/Navigation';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar, Box, Chip, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';

interface NavigationProps extends UserViewProps {
    userManager: boolean;
    userFlags: UserFlags | undefined;
    guild: RedisGuild | DataGuild;
    guildFlags: GuildFlags;
    guildConfiguration: GuildConfiguration;
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
        guildConfiguration,
        guilds,
        mutualGuilds,
        localization
    }: NavigationProps
) => {
    const { translations } = localization;

    const router = useRouter();

    const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

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
                            <ArrowBackIcon fontSize="small" />
                            {translations.back_to_select_guild}
                        </RouteLink>
                    </Fragment> : <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h3">{translations.dashboard}</Typography>
                        <Typography color="text.secondary">{translations.guild_settings}</Typography>
                    </Box>}
                    <Box sx={{ px: { xs: 1, md: 0 } }}>
                        {(userManager && !guilds.filter((guild) => mutualGuilds.includes(guild.id)).map((guild) => guild.id).includes(guild.id)) ?
                            <Box
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
                                choices={guilds.filter((guild) => mutualGuilds.includes(guild.id))}
                                localization={localization}
                            />}
                    </Box>
                    <NavigationDrawerContent>
                        <NavigationDrawerGroup>
                            <NavigationDrawerItem
                                href={prefix}
                                predicate={(pathname) => pathname === prefix}
                                icon={<HomeIcon />}
                                primary={translations.home}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/notifications`}
                                icon={<NotificationsIcon />}
                                primary={translations.notifications}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                        <NavigationDrawerGroup label={translations.settings_basic}>
                            <NavigationDrawerItem
                                href={`${prefix}/prefix-and-nickname`}
                                icon={<TagIcon />}
                                primary={translations.prefix_and_nickname}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/time-and-language`}
                                icon={<ScheduleIcon />}
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
                                icon={<SecurityIcon />}
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
                                icon={<LabelIcon />}
                                primary={translations.role_permissions}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                        <NavigationDrawerGroup label={translations.settings_features_and_options}>
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/member-join`}
                                icon={<PersonAddIcon />}
                                primary={translations.member_join}
                                enabled={guildConfiguration.member_join.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/goodbye`}
                                icon={<PersonRemoveIcon />}
                                primary={translations.goodbye_message}
                                enabled={guildConfiguration.goodbye.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/activity`}
                                icon={<DirectionsRunIcon />}
                                primary={translations.activity}
                                enabled={guildConfiguration.activity.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            {guildFlags.tester && <NavigationDrawerItem
                                href={`${prefix}/role-panels`}
                                icon={<LabelIcon />}
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
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/level`}
                                icon={<EmojiEventsIcon />}
                                primary={translations.level}
                                enabled={guildConfiguration.level.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/translate`}
                                icon={<TranslateIcon />}
                                primary={translations.translate}
                                enabled={guildConfiguration.translate.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/vote`}
                                icon={<MonitoringIcon />}
                                primary={translations.vote}
                                enabled={guildConfiguration.vote.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/quote`}
                                icon={<FormatQuoteIcon />}
                                primary={translations.quote}
                                enabled={guildConfiguration.quote.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/music`}
                                icon={<MusicNoteIcon />}
                                primary={translations.music}
                                enabled={guildConfiguration.music.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                            {guildFlags.tester && <NavigationDrawerItem
                                href={`${prefix}/text-to-speech`}
                                icon={<RecordVoiceOverIcon />}
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
                            <NavigationDrawerItemWithEnabledStatus
                                href={`${prefix}/logging`}
                                icon={<TextSnippetIcon />}
                                primary={translations.logging}
                                enabled={guildConfiguration.logging.enabled}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                        <NavigationDrawerGroup label={translations.settings_web}>
                            <NavigationDrawerItem
                                href={`${prefix}/web/articles`}
                                icon={<DocsIcon />}
                                primary={translations.web_pages}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/web/categories`}
                                icon={<CategoryIcon />}
                                primary={translations.categories}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/web/tags`}
                                icon={<LabelIcon />}
                                primary={translations.tags}
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
