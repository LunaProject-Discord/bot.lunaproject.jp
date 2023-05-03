'use client';

import {
    DrawerContainer,
    DrawerContent,
    DrawerItem,
    PermanentDrawer,
    StyledUl,
    TemporaryDrawer
} from '@lunaproject-discord/web-core/dist/components/Drawer';
import {
    DirectionsRunOutlined,
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
    SellOutlined,
    TextSnippetOutlined,
    TranslateOutlined
} from '@mui/icons-material';
import { Avatar, ButtonBase, IconButton, ListItemIcon, ListItemText, styled, Typography } from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import React, { Fragment, MouseEventHandler, useState } from 'react';
import { AppBar, Toolbar } from '../../../components/appbar';
import { Translations } from '../../../interfaces/localization';
import { DataGuild, RedisGuild } from '../../../interfaces/redis';
import { getGuildIcon } from '../../../utils/cdn';

interface Props {
    guild: RedisGuild | DataGuild;
    translations: Translations;
}

interface HeaderProps {
    onDrawerToggleClick: MouseEventHandler;
}

const Header = ({ onDrawerToggleClick }: HeaderProps) => (
    <AppBar>
        <Toolbar>
            <IconButton onClick={onDrawerToggleClick} color="inherit">
                <MenuOutlined />
            </IconButton>
            <Image src="/logo/yudzuki.svg" alt="" width={158} height={40} />
        </Toolbar>
    </AppBar>
);

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
                    <IconButton onClick={onDrawerToggleClick} sx={{ display: { md: 'none' } }}>
                        <MenuOutlined />
                    </IconButton>
                    <Typography variant="h5">{translations.guild_settings}</Typography>
                </DrawerHeader>
                <HeaderButtonContainer>
                    <ButtonBase
                        component={NextLink}
                        href={`/dashboard/${guild.id}`}
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
                            <Avatar src={getGuildIcon(guild)} />
                        </ListItemIcon>
                        <ListItemText primary={guild.name} sx={{ m: 0 }} />
                    </ButtonBase>
                </HeaderButtonContainer>
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

export const Navigation = ({ guild, translations }: Props) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => setOpen((prevOpen) => !prevOpen);

    return (
        <Fragment>
            <Header onDrawerToggleClick={handleDrawerToggle} />
            <Drawer guild={guild} translations={translations} open={open} onDrawerToggleClick={handleDrawerToggle} />
        </Fragment>
    );
};
