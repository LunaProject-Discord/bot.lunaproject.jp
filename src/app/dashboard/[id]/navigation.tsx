'use client';

import { PopoverType } from '@app/_navigation';
import { MobileNavigationAppBarMenu } from '@app/_navigation/mobile';
import { UserPopover } from '@app/_popovers/user';
import { AppBar, Toolbar } from '@components/appbar';
import { CommandBoxIcon } from '@components/icons';
import { GuildFlags } from '@interfaces/bot';
import { DataGuild, RedisGuild } from '@interfaces/redis';
import { UserViewProps } from '@interfaces/view';
import {
    DrawerContainer,
    DrawerContent,
    DrawerGroup,
    DrawerRouteLinkItem,
    DrawerRouteLinkItemProps,
    PermanentDrawer,
    StyledUl,
    TemporaryDrawer
} from '@lunaproject-discord/web-core/dist/components/Drawer';
import { RouteLink } from '@lunaproject-discord/web-core/dist/components/Link';
import { OAuthGuild } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import {
    DirectionsRunOutlined,
    DriveFileRenameOutlineOutlined,
    EmojiEventsOutlined,
    FormatQuoteOutlined,
    HomeOutlined,
    MenuOutlined,
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
import { Box, Chip, IconButton, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Dispatch, Fragment, MouseEventHandler, SetStateAction, useState } from 'react';
import { GuildSelect } from './components';

interface Props extends UserViewProps {
    guild: RedisGuild | DataGuild;
    flags: GuildFlags;

    guilds: OAuthGuild[];
    mutualGuilds: string[];
}

interface HeaderProps extends Omit<Props, 'guilds' | 'mutualGuilds'> {
    onDrawerToggleClick: MouseEventHandler;
}

const Header = ({ onDrawerToggleClick, user, localization }: HeaderProps) => {
    const [popoverState, setPopoverState] = useState<PopoverType>(undefined);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = popoverState !== undefined && Boolean(anchorEl);

    const openPopover = (elem: HTMLButtonElement, type: PopoverType) => {
        setPopoverState(type);
        setAnchorEl(elem);
    };

    const closePopover = () => {
        setPopoverState(undefined);
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <AppBar>
                <Toolbar>
                    <IconButton onClick={onDrawerToggleClick} color="inherit">
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

            <UserPopover
                open={popoverState === 'user' && open}
                anchorEl={anchorEl}
                onClose={closePopover}
                user={user}
                localization={localization}
            />
        </Fragment>
    );
};

const DrawerHeader = styled('header')(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

const HeaderButtonContainer = styled('li')(({ theme }) => ({
    padding: theme.spacing(0, 1, 1),
    display: 'block'
}));

interface DrawerProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const DrawerItem = (
    {
        icon,
        label,
        href,
        exact,
        setOpen,
        depth = 1,
        ...props
    }: Omit<DrawerRouteLinkItemProps, 'onClick'> & DrawerProps
) => {
    const handleClick = () => setOpen(false);

    return (
        <DrawerRouteLinkItem
            icon={icon}
            label={label}
            href={href}
            exact={exact}
            onClick={handleClick}
            depth={depth}
            {...props}
        />
    );
};

const Drawer = (
    {
        open,
        setOpen,
        guild,
        flags,
        guilds,
        mutualGuilds,
        localization: { translations }
    }: DrawerProps & Props
) => {
    const router = useRouter();

    const handleDrawerClose = () => setOpen(false);

    const drawer = (
        <Fragment>
            <DrawerHeader sx={{ p: { md: 1.5 } }}>
                <IconButton onClick={handleDrawerClose} sx={{ display: { md: 'none' } }}>
                    <MenuOutlined />
                </IconButton>
                <Typography variant="h5">{translations.guild_settings}</Typography>
            </DrawerHeader>
            <DrawerContent>
                <StyledUl container>
                    <HeaderButtonContainer>
                        <GuildSelect
                            value={guild.id}
                            setValue={(value) => router.push(`/dashboard/${value}`)}
                            guilds={guilds}
                            mutualGuilds={mutualGuilds}
                        />
                    </HeaderButtonContainer>
                    <StyledUl sx={{ px: 1 }}>
                        <DrawerItem
                            icon={<HomeOutlined />}
                            label={translations.home}
                            href={`/dashboard/${guild.id}`}
                            exact
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<NotificationsOutlined />}
                            label={translations.notifications}
                            href={`/dashboard/${guild.id}/notifications`}
                            open={open}
                            setOpen={setOpen}
                        />
                    </StyledUl>
                    <DrawerGroup label={translations.settings_basic}>
                        <DrawerItem
                            icon={<DriveFileRenameOutlineOutlined />}
                            label={translations.prefix_and_nickname}
                            href={`/dashboard/${guild.id}/prefix-and-nickname`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<ScheduleOutlined />}
                            label={translations.time_and_language}
                            href={`/dashboard/${guild.id}/time-and-language`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<CommandBoxIcon />}
                            label={translations.commands}
                            href={`/dashboard/${guild.id}/commands`}
                            open={open}
                            setOpen={setOpen}
                        />
                    </DrawerGroup>
                    <DrawerGroup label={translations.settings_moderation_and_management}>
                        {flags.tester && <DrawerItem
                            icon={<SecurityOutlined />}
                            label={translations.automod}
                            href={`/dashboard/${guild.id}/automod`}
                            open={open}
                            setOpen={setOpen}
                        />}
                        <DrawerItem
                            icon={<SellOutlined />}
                            label={
                                <Box sx={{ width: '100%', pr: 1, display: 'flex', alignItems: 'center' }}>
                                    {translations.role_permissions}
                                    <Chip label="Beta" color="secondary" size="small" sx={{ height: 20, ml: 'auto' }} />
                                </Box>
                            }
                            href={`/dashboard/${guild.id}/check-role-permissions`}
                            open={open}
                            setOpen={setOpen}
                        />
                    </DrawerGroup>
                    <DrawerGroup label={translations.settings_features_and_options}>
                        <DrawerItem
                            icon={<PersonAddOutlined />}
                            label={translations.welcome_message}
                            href={`/dashboard/${guild.id}/welcome`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<PersonRemoveOutlined />}
                            label={translations.goodbye_message}
                            href={`/dashboard/${guild.id}/goodbye`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<DirectionsRunOutlined />}
                            label={translations.activity}
                            href={`/dashboard/${guild.id}/activity`}
                            open={open}
                            setOpen={setOpen}
                        />
                        {flags.tester && <DrawerItem
                            icon={<SellOutlined />}
                            label={translations.role_panels}
                            href={`/dashboard/${guild.id}/role-panels`}
                            open={open}
                            setOpen={setOpen}
                        />}
                        <DrawerItem
                            icon={<EmojiEventsOutlined />}
                            label={translations.level}
                            href={`/dashboard/${guild.id}/level`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<TranslateOutlined />}
                            label={translations.translate}
                            href={`/dashboard/${guild.id}/translate`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<PollOutlined />}
                            label={translations.vote}
                            href={`/dashboard/${guild.id}/vote`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<FormatQuoteOutlined />}
                            label={translations.quote}
                            href={`/dashboard/${guild.id}/quote`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<MusicNoteOutlined />}
                            label={translations.music}
                            href={`/dashboard/${guild.id}/music`}
                            open={open}
                            setOpen={setOpen}
                        />
                        {flags.tester && <DrawerItem
                            icon={<RecordVoiceOverOutlined />}
                            label={translations.text_to_speech}
                            href={`/dashboard/${guild.id}/text-to-speech`}
                            open={open}
                            setOpen={setOpen}
                        />}
                        <DrawerItem
                            icon={<TextSnippetOutlined />}
                            label={translations.logging}
                            href={`/dashboard/${guild.id}/logging`}
                            open={open}
                            setOpen={setOpen}
                        />
                    </DrawerGroup>
                </StyledUl>
            </DrawerContent>
        </Fragment>
    );

    return (
        <DrawerContainer>
            <TemporaryDrawer
                variant="temporary"
                open={open}
                onClose={handleDrawerClose}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </TemporaryDrawer>
            <PermanentDrawer variant="permanent">
                {drawer}
            </PermanentDrawer>
        </DrawerContainer>
    );
};

export const Navigation = ({ guild, flags, user, guilds, mutualGuilds, localization }: Props) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => setOpen((prevState) => !prevState);

    return (
        <Fragment>
            <Header
                onDrawerToggleClick={handleDrawerToggle}
                guild={guild}
                flags={flags}
                user={user}
                localization={localization}
            />
            <Drawer
                open={open}
                setOpen={setOpen}
                guild={guild}
                flags={flags}
                user={user}
                guilds={guilds}
                mutualGuilds={mutualGuilds}
                localization={localization}
            />
        </Fragment>
    );
};
