'use client';

import { FormatListBulletedIcon, GridViewIcon } from '@components/icons';
import { PageHeader, PageLayout } from '@components/layout_v2';
import { LocalizationProps } from '@interfaces/localization';
import { Gallery, GalleryItem, GalleryItemIcon, GalleryItemText } from '@lunaproject/web-core/dist/components/Gallery';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { RouteLinkItem } from '@lunaproject/web-core/dist/components/SectionItems';
import { SegmentedControl } from '@lunaproject/web-core/dist/components/SegmentedControl';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar, ButtonBase, CircularProgress } from '@mui/material';
import { getGuildIcon } from '@utils/discord';
import NextLink from 'next/link';
import React, { Fragment, useState } from 'react';

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
}

export const View = ({ guilds, localization: { translations } }: Props) => {
    const [viewType, setViewType] = useState<ViewType>('gallery');

    return (
        <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
            <PageHeader primary={translations.leaderboard} secondary={translations.leaderboard_description}>
                <SegmentedControl<ViewType>
                    value={viewType}
                    setValue={setViewType}
                    choices={[
                        { value: 'gallery', children: (<GridViewIcon />) },
                        { value: 'table', children: (<FormatListBulletedIcon />) }
                    ]}
                />
            </PageHeader>
            <Section>
                {viewType === 'gallery' ? (<GuildsGallery guilds={guilds} />) : (<GuildsTable guilds={guilds} />)}
            </Section>
        </PageLayout>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
        <PageHeader primary={translations.leaderboard} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageLayout>
);
