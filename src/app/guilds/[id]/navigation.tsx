'use client';

import {
    AppBar,
    DrawerContainer,
    DrawerContent,
    DrawerItem,
    PermanentDrawer,
    StyledUl,
    TemporaryDrawer
} from '@lunaproject-discord/web-core';
import {
    ArrowBackOutlined,
    DriveFileRenameOutlineOutlined,
    EmojiEventsOutlined,
    FormatQuoteOutlined,
    MenuOutlined,
    MusicNoteOutlined,
    PersonAddOutlined,
    PersonRemoveOutlined,
    PollOutlined,
    RecordVoiceOverOutlined,
    ScheduleOutlined,
    TextSnippetOutlined,
    TranslateOutlined
} from '@mui/icons-material';
import { Avatar, ButtonBase, IconButton, ListItemIcon, ListItemText, styled, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import React, { Fragment, MouseEventHandler, useState } from 'react';
import { OAuthGuild } from '../../../interfaces/discord';
import { Translation } from '../../../interfaces/language';

interface Props {
    guild: OAuthGuild;
    translations: Translation;
}

interface HeaderProps {
    onDrawerToggleClick: MouseEventHandler;
}

const Header = ({ onDrawerToggleClick }: HeaderProps) => {
    return (
        <AppBar position="fixed" color="default" elevation={0} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Toolbar>
                <IconButton
                    onClick={onDrawerToggleClick}
                    edge="start"
                    color="inherit"
                    sx={{ mr: 2 }}
                >
                    <MenuOutlined />
                </IconButton>
                <Image src="/logo/Yudzuki.svg" alt="" width={158} height={40} />
            </Toolbar>
        </AppBar>
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

const Drawer = ({ guild, translations, open, onDrawerToggleClick }: DrawerProps) => {
    const drawer = (
        <DrawerContent>
            <StyledUl container>
                <DrawerHeader>
                    <IconButton component={NextLink} href="/guilds">
                        <ArrowBackOutlined />
                    </IconButton>
                    <Typography variant="h5">
                        {translations.server_settings}
                    </Typography>
                </DrawerHeader>
                <HeaderButtonContainer>
                    <ButtonBase
                        component={NextLink}
                        href={`/guilds/${guild.id}`}
                        disableRipple
                        sx={{
                            width: '100%',
                            height: 60,
                            p: 1,
                            borderRadius: 1,
                            transition: 'color 150ms cubic-bezier(.4, 0, .2, 1) 0ms, background-color 150ms cubic-bezier(.4, 0, .2, 1) 0ms',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            },
                            '&:active': {
                                bgcolor: 'action.focus'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 46 }}>
                            <Avatar
                                src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : undefined}
                                alt={guild.name}
                            />
                        </ListItemIcon>
                        <ListItemText primary={guild.name} sx={{ m: 0 }} />
                    </ButtonBase>
                </HeaderButtonContainer>
                <DrawerItem label={translations.settings_basic} openImmediately>
                    <DrawerItem
                        href={`/guilds/${guild.id}/prefix-nickname`}
                        icon={<DriveFileRenameOutlineOutlined />}
                        label={translations.prefix_and_nickname}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/time-language`}
                        icon={<ScheduleOutlined />}
                        label={translations.time_and_language}
                        depth={1}
                    />
                </DrawerItem>
                <DrawerItem label={translations.settings_features_and_options} openImmediately>
                    <DrawerItem
                        href={`/guilds/${guild.id}/welcome`}
                        icon={<PersonAddOutlined />}
                        label={translations.welcome_message}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/goodbye`}
                        icon={<PersonRemoveOutlined />}
                        label={translations.goodbye_message}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/level`}
                        icon={<EmojiEventsOutlined />}
                        label={translations.level}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/translate`}
                        icon={<TranslateOutlined />}
                        label={translations.translate}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/vote`}
                        icon={<PollOutlined />}
                        label={translations.vote}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/quote`}
                        icon={<FormatQuoteOutlined />}
                        label={translations.quote}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/music`}
                        icon={<MusicNoteOutlined />}
                        label={translations.music}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/text-to-speech`}
                        icon={<RecordVoiceOverOutlined />}
                        label={translations.text_to_speech}
                        depth={1}
                    />
                    <DrawerItem
                        href={`/guilds/${guild.id}/logging`}
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

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.up('md')]: {
        display: 'none'
    }
}));

export const Navigation = ({ guild, translations }: Props) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => setOpen(!open);

    return (
        <Fragment>
            <Header onDrawerToggleClick={handleDrawerToggle} />
            <Drawer guild={guild} translations={translations} open={open} onDrawerToggleClick={handleDrawerToggle} />
        </Fragment>
    );
};
