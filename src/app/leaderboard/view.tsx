'use client';

import { PageHeader } from '@components/layout';
import { PageLayout } from '@components/layout_v2';
import { LocalizationProps } from '@interfaces/localization';
import {
    Gallery,
    GalleryItem,
    GalleryItemIcon,
    GalleryItemText
} from '@lunaproject-discord/web-core/dist/components/Gallery';
import { Section } from '@lunaproject-discord/web-core/dist/components/Section';
import { SegmentedControl } from '@lunaproject-discord/web-core/dist/components/SegmentedControl';
import { OAuthGuild } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { FormatListBulletedOutlined, GridViewOutlined } from '@mui/icons-material';
import {
    Avatar,
    Box,
    ButtonBase,
    CircularProgress,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { getGuildIcon } from '../../utils/discord';

interface GuildsProps {
    guilds: OAuthGuild[];
}

const GuildsGallery = ({ guilds }: GuildsProps) => (
    <Gallery sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {guilds.map((guild) => (
            <GalleryItem key={guild.id}>
                <ButtonBase component={NextLink} href={`/leaderboard/${guild.id}`}>
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
                href={`/leaderboard/${guild.id}`}
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
}

export const View = ({ guilds, localization: { translations } }: Props) => {
    const [viewType, setViewType] = useState<ViewType>('gallery');

    return (
        <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.leaderboard}</Typography>
                    <Typography>{translations.choose_guild_leaderboard}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 3 }}>
                    <SegmentedControl<ViewType>
                        value={viewType}
                        setValue={setViewType}
                        choices={[
                            { value: 'gallery', children: (<GridViewOutlined />) },
                            { value: 'table', children: (<FormatListBulletedOutlined />) }
                        ]}
                    />
                </Box>
            </PageHeader>
            <Section>
                {viewType === 'gallery' ? (<GuildsGallery guilds={guilds} />) : (<GuildsTable guilds={guilds} />)}
            </Section>
        </PageLayout>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.leaderboard}</Typography>
                <Typography>{translations.loading}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageLayout>
);
