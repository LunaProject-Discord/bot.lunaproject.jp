'use client';

import { DesktopMediaPanel } from '@app/_panels/media/desktop';
import { MediaWebSocketHook, useMediaWebSocket } from '@app/_panels/media/hooks';
import { MobileMediaPanel } from '@app/_panels/media/mobile';
import { StatusResponse } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { OAuthUser } from '@lunaproject-discord/web-discord';
import { Theme, useMediaQuery } from '@mui/material';
import { mediaPanelOpenAtom } from '@states/media';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

export interface MediaPanelHookProps {
    hook: MediaWebSocketHook;
}

export interface MediaPanelStatusProps {
    status?: StatusResponse;
}

export interface MediaPanelProps extends LocalizationProps {
    user: OAuthUser;
}

export const MediaPanel = ({ user, localization }: MediaPanelProps) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const open = useRecoilValue(mediaPanelOpenAtom);

    const hook = useMediaWebSocket(user);

    useEffect(() => {
        if (open && document.visibilityState === 'visible')
            hook.requestStatus();

        const timerId = window.setInterval(() => {
            if (open && document.visibilityState === 'visible')
                hook.requestStatus();
        }, 1000 * 10);

        const handleVisibilityChange = () => {
            if (open && document.visibilityState === 'visible')
                hook.requestStatus();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.clearInterval(timerId);

            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [open]);

    if (isDesktop) {
        return (<DesktopMediaPanel user={user} hook={hook} localization={localization} />);
    } else {
        return (<MobileMediaPanel user={user} hook={hook} localization={localization} />);
    }
};
