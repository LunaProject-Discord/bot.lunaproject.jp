'use client';

import {
    Gallery,
    GalleryItem,
    GalleryItemIcon,
    GalleryItemText
} from '@lunaproject-discord/web-core/dist/components/Gallery';
import { Menu } from '@lunaproject-discord/web-core/dist/components/Menu';
import { Section } from '@lunaproject-discord/web-core/dist/components/Section';
import { SegmentedControl } from '@lunaproject-discord/web-core/dist/components/SegmentedControl';
import { OAuthGuild } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
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
    Typography
} from '@mui/material';
import NextLink from 'next/link';
import React, { MouseEvent, useState } from 'react';
import { PageContent, PageHeader } from '../../components/layout';
import { LocalizationProps } from '../../interfaces/localization';
import { getGuildIcon } from '../../utils/discord';

interface GuildsProps {
    guilds: OAuthGuild[];
}

const GuildsGallery = ({ guilds }: GuildsProps) => (
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

const GuildsTable = ({ guilds }: GuildsProps) => (
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

interface Props extends LocalizationProps {
    guilds: OAuthGuild[];
    mutualGuilds: string[];
}

export const View = ({ guilds, mutualGuilds, localization: { translations } }: Props) => {
    const [viewAs, setViewAs] = useState<ViewType>('gallery');

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleViewAsChange = (e: MouseEvent<HTMLElement>, newViewAs: ViewType) => {
        if (newViewAs)
            setViewAs(newViewAs);
    };

    const handleInviteButtonClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <PageContent display="flex">
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.guild_settings}</Typography>
                    <Typography variant="body1">{translations.choose_guild_settings}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 3 }}>
                    <SegmentedControl<ViewType>
                        value={viewAs}
                        setValue={setViewAs}
                        choices={[
                            { value: 'gallery', children: (<GridViewOutlined />) },
                            { value: 'table', children: (<FormatListBulletedOutlined />) }
                        ]}
                    />
                    <Button
                        onClick={handleInviteButtonClick}
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
                    <GuildsGallery guilds={guilds.filter((guild) => mutualGuilds.includes(guild.id))} />
                ) : (
                    <GuildsTable guilds={guilds.filter((guild) => mutualGuilds.includes(guild.id))} />
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

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.guild_settings}</Typography>
                <Typography variant="body1">{translations.choose_guild_settings}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageContent>
);
