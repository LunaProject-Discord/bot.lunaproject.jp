'use client';

import { FormatListBulletedIcon, GridViewIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { getGuildIcon } from '@/utils/discord';
import { Gallery, GalleryItem, GalleryItemIcon, GalleryItemText } from '@lunaproject/web-core/dist/components/Gallery';
import { PageHeader, PageLayout } from '@lunaproject/web-core/dist/components/Layout';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { SectionRouteLinkCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { SegmentedControl, segmentedControlClasses } from '@lunaproject/web-core/dist/components/SegmentedControl';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar, ButtonBase, CircularProgress } from '@mui/material';
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
            <SectionRouteLinkCard
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
                    sx={{
                        height: (theme) => theme.spacing(6),
                        p: .25,
                        borderRadius: 1.5,
                        [`& .${segmentedControlClasses.button}`]: {
                            aspectRatio: '1'
                        }
                    }}
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
