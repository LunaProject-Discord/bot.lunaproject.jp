'use client';

import {
    Gallery,
    GalleryItem,
    GalleryItemIcon,
    GalleryItemText,
    Menu
} from '@lunaproject-discord/web-core/dist/components';
import { OAuthGuild } from '@lunaproject-discord/web-discord';
import {
    AddOutlined,
    FormatListBulletedOutlined,
    GridViewOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    CircularProgress,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import NextLink from 'next/link';
import React, { MouseEvent, useState } from 'react';
import { PageContent, PageHeader } from '../../components/layout';
import { Section } from '../../components/section';
import { TranslatableViewProps } from '../../interfaces/view';
import { getGuildIcon } from '../../utils/discord';

interface GuildListProps {
    guilds: OAuthGuild[];
}

const GuildListGallery = ({ guilds }: GuildListProps) => (
    <Gallery>
        {guilds.map((guild) => (
            <GalleryItem key={guild.id}>
                <ButtonBase component={NextLink} href={`/dashboard/${guild.id}`}>
                    <GalleryItemIcon>
                        <Avatar
                            src={getGuildIcon(guild)}
                            alt={guild.name}
                            sx={{ width: 100, height: 100 }}
                        />
                    </GalleryItemIcon>
                    <GalleryItemText>{guild.name}</GalleryItemText>
                </ButtonBase>
            </GalleryItem>
        ))}
    </Gallery>
);

const GuildListTable = ({ guilds }: GuildListProps) => (
    <List>
        {guilds.map((guild) => (
            <ListItemButton
                key={guild.id}
                component={NextLink}
                href={`/dashboard/${guild.id}`}
                sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                }}
            >
                <ListItemIcon>
                    <Avatar
                        src={getGuildIcon(guild)}
                        alt={guild.name}
                    />
                </ListItemIcon>
                <ListItemText primary={guild.name} />
            </ListItemButton>
        ))}
    </List>
);

type ViewType = 'gallery' | 'table';

interface Props extends TranslatableViewProps {
    guilds: OAuthGuild[];
    mutualGuilds: string[];
}

export const View = ({ guilds, mutualGuilds, translations }: Props) => {
    const [viewAs, setViewAs] = useState<ViewType>('gallery');

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleChangeViewAs = (e: MouseEvent<HTMLElement>, newViewAs: ViewType) => {
        if (newViewAs)
            setViewAs(newViewAs);
    };

    const handleClickInviteButton = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
    };

    console.log(guilds, mutualGuilds);

    return (
        <PageContent display="flex">
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.server_settings}</Typography>
                    <Typography variant="body1">{translations.choose_server_settings}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 3 }}>
                    <ToggleButtonGroup value={viewAs} onChange={handleChangeViewAs} exclusive>
                        <ToggleButton value="gallery">
                            <GridViewOutlined />
                        </ToggleButton>
                        <ToggleButton value="table">
                            <FormatListBulletedOutlined />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                        onClick={handleClickInviteButton}
                        disableElevation
                        variant="contained"
                        size="large"
                        startIcon={<AddOutlined />}
                        endIcon={open ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                        sx={{ width: '100%', height: 48, px: 2 }}
                    >
                        Bot を導入
                    </Button>
                </Box>
            </PageHeader>
            <Section sx={{ p: 0 }}>
                {viewAs === 'gallery' ? (
                    <GuildListGallery guilds={guilds.filter((guild) => mutualGuilds.includes(guild.id))} />
                ) : (
                    <GuildListTable guilds={guilds.filter((guild) => mutualGuilds.includes(guild.id))} />
                )}
            </Section>

            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {guilds.filter((guild) => !mutualGuilds.includes(guild.id)).map((guild) => (
                    <MenuItem key={guild.id} component={NextLink} href={`/invite/${guild.id}`}>
                        <ListItemIcon>
                            <Avatar
                                src={getGuildIcon(guild)}
                                alt={guild.name}
                                sx={{ width: 24, height: 24 }}
                            />
                        </ListItemIcon>
                        <ListItemText primary={guild.name} />
                    </MenuItem>
                ))}
            </Menu>
        </PageContent>
    );
};

export const LoadingView = ({ translations }: TranslatableViewProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.server_settings}</Typography>
                <Typography variant="body1">{translations.choose_server_settings}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageContent>
);
