'use client';

import {
    DesktopPanelDrawer,
    DesktopPanelHeaderRoot,
    DesktopPanelToggleButton,
    PanelContentRoot,
    PanelRoot,
    PanelThemeProvider
} from '@app/_panels/components';
import {
    MediaPanelContentArtwork,
    MediaPanelContentPlayPauseButton,
    MediaPanelContentQueuedTrack,
    MediaPanelContentQueueRoot,
    MediaPanelContentSeekSlider,
    MediaPanelContentSeekSliderText,
    MediaPanelContentTrackInfo
} from '@app/_panels/media/components';
import { MediaWebSocketHook } from '@app/_panels/media/hooks';
import { MediaPanelHookProps, MediaPanelProps, MediaPanelStatusProps } from '@app/_panels/media/index';
import { formatDuration } from '@app/_panels/media/utils';
import { CloseOutlined, MusicNoteOutlined, Pause, PlayArrow, SkipNext, SkipPrevious } from '@mui/icons-material';
import { Box, IconButton, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { mediaPanelOpenAtom } from '@states/media';
import React, { Fragment, SyntheticEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export const DesktopMediaPanelHeader = ({ status }: MediaPanelStatusProps) => {
    const setOpen = useSetRecoilState(mediaPanelOpenAtom);

    const guild = status?.guild;
    const channel = status?.channel;

    return (
        <DesktopPanelHeaderRoot>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>メディア パネル</Typography>
                {(guild && channel) && <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: 12,
                        lineHeight: 'unset'
                    }}
                >
                    {guild.name} {'>'} {channel.name}
                </Typography>}
            </Box>
            <IconButton onClick={() => setOpen(false)} color="inherit" sx={{ ml: 'auto' }}>
                <CloseOutlined />
            </IconButton>
        </DesktopPanelHeaderRoot>
    );
};

export const DesktopMediaPanelContentPlayingTrack = ({ hook: { status, pause, resume, seek, skip } }: MediaPanelHookProps) => {
    const open = useRecoilValue(mediaPanelOpenAtom);

    const player = status?.player;
    const isPaused = player?.paused;
    const track = player?.playing_track;
    const duration = track ? Math.round(Number(track.duration) / 1000) : 0;

    const [seeking, setSeeking] = useState(false);
    const [position, setPosition] = useState(duration);

    const handleSeekSliderChange = (_: Event, value: number | number[]) => {
        if (typeof value === 'number')
            setPosition(value);
    };

    const handleSeekSliderChangeCommitted = (_: SyntheticEvent | Event, value: number | number[]) => {
        setSeeking(false);
        if (typeof value === 'number')
            seek((value * 1000).toString());
    };

    useEffect(() => {
        if (!seeking && player?.position)
            setPosition(() => player.position ? Math.round(Number(player.position) / 1000) : duration);

        const timerId = window.setInterval(() => {
            if (!open || document.visibilityState !== 'visible' || seeking || isPaused) return;
            setPosition((prevPosition) => prevPosition < duration ? prevPosition + 1 : duration);
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [open, seeking, isPaused, duration, player?.position]);

    if (!player || !track)
        return (<Fragment />);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <MediaPanelContentArtwork src={track.artworkUrl} alt={track.title} />
            <MediaPanelContentTrackInfo track={track} />
            <Box sx={{ mt: -1.5, display: 'flex', flexDirection: 'column' }}>
                <MediaPanelContentSeekSlider
                    value={position}
                    onChange={handleSeekSliderChange}
                    onChangeCommitted={handleSeekSliderChangeCommitted}
                    min={0}
                    max={duration}
                    step={1}
                    size="small"
                    slotProps={{
                        thumb: {
                            onMouseDown: () => setSeeking(true)
                        }
                    }}
                />
                <Box
                    sx={{
                        mt: -1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <MediaPanelContentSeekSliderText>
                        {formatDuration(position)}
                    </MediaPanelContentSeekSliderText>
                    <MediaPanelContentSeekSliderText>
                        {formatDuration(duration)}
                    </MediaPanelContentSeekSliderText>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', placeItems: 'center', placeContent: 'center', gap: 1 }}>
                <Tooltip title="前のメディア" placement="top">
                    <IconButton onClick={() => skip('previous')}>
                        <SkipPrevious />
                    </IconButton>
                </Tooltip>
                <Tooltip title={isPaused ? '再生' : '一時停止'} placement="top">
                    <MediaPanelContentPlayPauseButton onClick={() => isPaused ? resume() : pause()} size="large">
                        {isPaused ? <PlayArrow /> : <Pause />}
                    </MediaPanelContentPlayPauseButton>
                </Tooltip>
                <Tooltip title="次のメディア" placement="top">
                    <IconButton onClick={() => skip('next')}>
                        <SkipNext />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export const DesktopMediaPanelContentQueue = ({ hook: { status } }: MediaPanelHookProps) => {
    const player = status?.player;
    const queue = player?.queue;

    if (!player || !queue)
        return (<Fragment />);

    const tracks = queue.tracks;

    return (
        <MediaPanelContentQueueRoot>
            {tracks.map((track) => (
                <MediaPanelContentQueuedTrack key={track.id} track={track} />
            ))}
        </MediaPanelContentQueueRoot>
    );
};

export interface DesktopMediaPanelContentProps {
    hook: MediaWebSocketHook;
}

export const DesktopMediaPanelContent = ({ hook }: DesktopMediaPanelContentProps) => (
    <PanelRoot>
        <DesktopMediaPanelHeader status={hook.status} />
        <PanelContentRoot sx={{ overflow: 'hidden' }}>
            <DesktopMediaPanelContentPlayingTrack hook={hook} />
            <DesktopMediaPanelContentQueue hook={hook} />
        </PanelContentRoot>
    </PanelRoot>
);

export const DesktopMediaPanel = ({ hook, localization }: MediaPanelProps & MediaPanelHookProps) => {
    const isXl = useMediaQuery<Theme>((theme) => theme.breakpoints.up('xl'));

    const [open, setOpen] = useRecoilState(mediaPanelOpenAtom);

    return (
        <Fragment>
            <PanelThemeProvider localization={localization}>
                {isXl ? <DesktopPanelDrawer
                    open={open}
                    variant="persistent"
                    anchor="right"
                    sx={{ display: { md: 'none', xl: 'block' } }}
                >
                    <DesktopMediaPanelContent hook={hook} />
                </DesktopPanelDrawer> : <DesktopPanelDrawer
                    open={open}
                    onClose={() => setOpen(false)}
                    anchor="right"
                    sx={{
                        display: { xl: 'none' }
                    }}
                >
                    <DesktopMediaPanelContent hook={hook} />
                </DesktopPanelDrawer>}
            </PanelThemeProvider>

            <Tooltip title="メディア パネルを開く" placement="left">
                <DesktopPanelToggleButton onClick={() => setOpen((open) => !open)}>
                    <MusicNoteOutlined />
                </DesktopPanelToggleButton>
            </Tooltip>
        </Fragment>
    );
};
