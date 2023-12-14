'use client';

import {
    AddIcon,
    FormatListBulletedIcon,
    GridViewIcon,
    KeyboardArrowDownIcon,
    KeyboardArrowUpIcon
} from '@components/icons';
import { PageHeader, PageLayout } from '@components/layout_v2';
import { LocalizationProps } from '@interfaces/localization';
import { Gallery, GalleryItem, GalleryItemIcon, GalleryItemText } from '@lunaproject/web-core/dist/components/Gallery';
import { Menu } from '@lunaproject/web-core/dist/components/Menu';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { RouteLinkItem } from '@lunaproject/web-core/dist/components/SectionItems';
import { SegmentedControl } from '@lunaproject/web-core/dist/components/SegmentedControl';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar, Button, ButtonBase, CircularProgress, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { getGuildIcon } from '@utils/discord';
import NextLink from 'next/link';
import React, { Fragment, MouseEvent, useState } from 'react';

interface GuildsProps {
    guilds: OAuthGuild[];
}

const GuildsGallery = ({ guilds }: GuildsProps) => (
    <Gallery sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
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
    <Fragment>
        {guilds.map((guild) => (
            <RouteLinkItem
                key={guild.id}
                icon={<Avatar src={getGuildIcon(guild)} alt={guild.name} />}
                primary={guild.name}
                href={`/dashboard/${guild.id}`}
            />
        ))}
    </Fragment>
);

type ViewType = 'gallery' | 'table';

interface Props extends LocalizationProps {
    guilds: OAuthGuild[];
    mutualGuilds: string[];
}

export const View = ({ guilds, mutualGuilds, localization: { translations } }: Props) => {
    const [viewType, setViewType] = useState<ViewType>('gallery');

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleInviteButtonClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
            <PageHeader primary={translations.guild_settings} secondary={translations.guild_settings_description}>
                <SegmentedControl<ViewType>
                    value={viewType}
                    setValue={setViewType}
                    choices={[
                        { value: 'gallery', children: (<GridViewIcon />) },
                        { value: 'table', children: (<FormatListBulletedIcon />) }
                    ]}
                />
                <Button
                    onClick={handleInviteButtonClick}
                    disableElevation
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    sx={{ width: '100%', height: 48, px: 2 }}
                >
                    {translations.add_bot}
                </Button>
            </PageHeader>
            <Section>
                {viewType === 'gallery' ? (
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
        </PageLayout>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
        <PageHeader primary={translations.guild_settings} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageLayout>
);
