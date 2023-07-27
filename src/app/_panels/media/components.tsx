'use client';

import { PlayingTrack } from '@interfaces/bot';
import { Link } from '@lunaproject-discord/web-core/dist/components/Link';
import { MuiLightTheme } from '@lunaproject-discord/web-core/dist/utils/theme';
import { alpha, Box, buttonBaseClasses, IconButton, Slider, sliderClasses, styled, Typography } from '@mui/material';
import { ellipsis } from 'polished';
import React from 'react';

export const MediaPanelContentArtwork = styled('img')(({ theme }) => ({
    width: '100%',
    aspectRatio: '16 / 9',
    pointerEvents: 'none',
    objectFit: 'cover',
    backgroundColor: theme.palette.common.black,
    borderRadius: theme.shape.borderRadius
}));

export interface MediaPanelContentTrackInfoProps {
    track: PlayingTrack;
}

export const MediaPanelContentTrackInfo = ({ track: { title, url, author } }: MediaPanelContentTrackInfoProps) => (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Link href={url} target="_blank" color="text.primary" sx={{ ...ellipsis() }}>{title}</Link>
        <Typography variant="body2" color="text.secondary" sx={{ ...ellipsis() }}>{author}</Typography>
    </Box>
);

export const MediaPanelContentSeekSlider = styled(Slider)(({ theme }) => ({
    height: 4,
    color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, .87)',
    [`& .${sliderClasses.thumb}`]: {
        width: 8,
        height: 8,
        transition: '.3s cubic-bezier(.47, 1.64, .41, .8)',
        '&:before': {
            boxShadow: '0 2px 12px 0 rgba(0, 0, 0, .4)'
        },
        [`&:hover, &.${sliderClasses.focusVisible}`]: {
            boxShadow: `0 0 0 8px ${theme.palette.mode === 'dark' ? 'rgb(255 255 255 / 16%)' : 'rgb(0 0 0 / 16%)'}`
        },
        [`&.${sliderClasses.active}`]: {
            width: 20,
            height: 20
        }
    },
    [`& .${sliderClasses.rail}`]: {
        opacity: .28
    }
}));

export const MediaPanelContentSeekSliderText = styled(Typography)({
    fontSize: '.75rem',
    fontWeight: 500,
    letterSpacing: 0.2,
    opacity: .38
});

export const MediaPanelContentPlayPauseButton = styled(IconButton)(({ theme }) => ({
    color: MuiLightTheme.palette.text.primary,
    backgroundColor: theme.palette.common.white,
    [`&:disabled, &.${buttonBaseClasses.disabled}`]: {
        color: theme.palette.action.disabled,
        backgroundColor: theme.palette.action.disabledBackground
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, theme.palette.action.hoverOpacity + .7)
    },
    [`&:active, &.${buttonBaseClasses.focusVisible}`]: {
        backgroundColor: alpha(theme.palette.common.white, theme.palette.action.focusOpacity + .6)
    }
}));

export const MediaPanelContentQueueRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    overflow: 'auto'
}));

export const MediaPanelContentQueuedTrackRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1)
}));

export const MediaPanelContentQueuedTrackContentArtwork = styled(MediaPanelContentArtwork)(({ theme }) => ({
    width: theme.spacing(16)
}));

export const MediaPanelContentQueuedTrackContentInfo = ({ track: { title, url, author } }: MediaPanelContentTrackInfoProps) => (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Link
            href={url}
            target="_blank"
            color="text.primary"
            sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
            }}
        >
            {title}
        </Link>
        <Typography variant="body2" color="text.secondary" sx={{ ...ellipsis() }}>{author}</Typography>
    </Box>
);

export const MediaPanelContentQueuedTrack = ({ track }: MediaPanelContentTrackInfoProps) => (
    <MediaPanelContentQueuedTrackRoot>
        <MediaPanelContentQueuedTrackContentArtwork src={track.artworkUrl} alt={track.title} />
        <MediaPanelContentQueuedTrackContentInfo track={track} />
    </MediaPanelContentQueuedTrackRoot>
);
