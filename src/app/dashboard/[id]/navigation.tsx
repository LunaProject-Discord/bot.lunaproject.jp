'use client';

import {
    DrawerContainer,
    DrawerContent,
    DrawerItem,
    PermanentDrawer,
    StyledUl,
    TemporaryDrawer
} from '@lunaproject-discord/web-core/dist/components/Drawer';
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
    SellOutlined,
    TextSnippetOutlined,
    TranslateOutlined
} from '@mui/icons-material';
import { Box, IconButton, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Fragment, MouseEventHandler, useState } from 'react';
import { PopoverType } from '../../(navigation)';
import { MobileNavigationAppBarMenu } from '../../(navigation)/mobile';
import { UserPopover } from '../../(popovers)/user';
import { AppBar, Toolbar } from '../../../components/appbar';
import { DataGuild, RedisGuild } from '../../../interfaces/redis';
import { UserViewProps } from '../../../interfaces/view';
import { GuildSelect } from './components';

interface Props extends UserViewProps {
    guild: RedisGuild | DataGuild;

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
        setPopoverState('user');
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
                    <Image src="/logo/yudzuki.svg" alt="" width={158} height={40} />
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

const DrawerHeader = styled('li')(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

const HeaderButtonContainer = styled('li')(({ theme }) => ({
    padding: theme.spacing(0, 1, 1),
    display: 'block'
}));

interface DrawerProps extends Props, HeaderProps {
    open: boolean;
}

const Drawer = (
    {
        open,
        onDrawerToggleClick,
        guild,
        guilds,
        mutualGuilds,
        localization: { translations }
    }: DrawerProps
) => {
    const router = useRouter();

    const drawer = (
        <DrawerContent>
            <StyledUl container>
                <DrawerHeader sx={{ p: { md: 1.5 } }}>
                    <IconButton onClick={onDrawerToggleClick} sx={{ display: { md: 'none' } }}>
                        <MenuOutlined />
                    </IconButton>
                    <Typography variant="h5">{translations.guild_settings}</Typography>
                </DrawerHeader>
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
                        href={`/dashboard/${guild.id}`}
                        icon={<HomeOutlined />}
                        label={translations.home}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/notifications`}
                        icon={<NotificationsOutlined />}
                        label={translations.notifications}
                        depth={1}
                    />
                </StyledUl>
                <DrawerItem label={translations.settings_basic} openImmediately>
                    <DrawerItem
                        href={`/dashboard/${guild.id}/prefix-nickname`}
                        icon={<DriveFileRenameOutlineOutlined />}
                        label={translations.prefix_and_nickname}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/time-language`}
                        icon={<ScheduleOutlined />}
                        label={translations.time_and_language}
                        depth={1}
                    />
                </DrawerItem>
                <DrawerItem label={translations.settings_guild_management} openImmediately>
                    <DrawerItem
                        href={`/dashboard/${guild.id}/welcome`}
                        icon={<PersonAddOutlined />}
                        label={translations.welcome_message}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/goodbye`}
                        icon={<PersonRemoveOutlined />}
                        label={translations.goodbye_message}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/activity`}
                        icon={<DirectionsRunOutlined />}
                        label={translations.activity}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/role-panels`}
                        icon={<SellOutlined />}
                        label={translations.role_panels}
                        depth={1}
                    />
                </DrawerItem>
                <DrawerItem label={translations.settings_features_and_options} openImmediately>
                    <DrawerItem
                        href={`/dashboard/${guild.id}/level`}
                        icon={<EmojiEventsOutlined />}
                        label={translations.level}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/translate`}
                        icon={<TranslateOutlined />}
                        label={translations.translate}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/vote`}
                        icon={<PollOutlined />}
                        label={translations.vote}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/quote`}
                        icon={<FormatQuoteOutlined />}
                        label={translations.quote}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/music`}
                        icon={<MusicNoteOutlined />}
                        label={translations.music}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/text-to-speech`}
                        icon={<RecordVoiceOverOutlined />}
                        label={translations.text_to_speech}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/dashboard/${guild.id}/logging`}
                        icon={<TextSnippetOutlined />}
                        label={translations.logging}
                        depth={1}
                    />
                </DrawerItem>
            </StyledUl>
        </DrawerContent>
    );

    return (
        <DrawerContainer>
            <TemporaryDrawer
                variant="temporary"
                open={open}
                onClose={onDrawerToggleClick}
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

export const Navigation = ({ guild, user, guilds, mutualGuilds, localization }: Props) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => setOpen((prevOpen) => !prevOpen);

    return (
        <Fragment>
            <Header
                onDrawerToggleClick={handleDrawerToggle}
                guild={guild}
                user={user}
                localization={localization}
            />
            <Drawer
                open={open}
                onDrawerToggleClick={handleDrawerToggle}
                guild={guild}
                user={user}
                guilds={guilds}
                mutualGuilds={mutualGuilds}
                localization={localization}
            />
        </Fragment>
    );
};
