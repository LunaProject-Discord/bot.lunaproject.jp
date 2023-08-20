'use client';

import { useWebSocket } from '@app/hooks';
import {
    MediaResponse,
    PauseRequest,
    PlayRequest,
    ResumeRequest,
    SeekRequest,
    SkipRequest,
    StatusRequest,
    StatusResponse,
    StopRequest
} from '@interfaces/bot';
import { RedisUser } from '@interfaces/redis';
import { OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { APIUser } from 'discord-api-types/v10';
import { useState } from 'react';

export type SkipMode = 'previous' | 'next';

export interface MediaWebSocketHook {
    socket: WebSocket | undefined,
    status: StatusResponse | undefined,
    requestStatus: () => void,
    play: (keyword: string) => void,
    pause: () => void,
    resume: () => void,
    stop: () => void,
    seek: (position: string) => void,
    skip: (mode: SkipMode) => void,
}

export const useMediaWebSocket = (user: OAuthUser | APIUser | RedisUser): MediaWebSocketHook => {
    const [status, setStatus] = useState<StatusResponse | undefined>();

    const [requestTrial, setRequestTrial] = useState(false);

    const { socket, send } = useWebSocket(`${process.env.NEXT_PUBLIC_BOT_WEBSOCKET_API_ORIGIN}/media?id=${user.id}`, {
        onOpen: () => requestStatus(),
        onMessage: (e: MessageEvent<string>) => {
            const data: MediaResponse = JSON.parse(e.data);

            switch (data.type) {
                case 'status':
                    setRequestTrial(false);
                    setStatus(data as StatusResponse);
                    break;
            }
        }
    });

    const requestStatus = () => {
        if (requestTrial) return;

        setRequestTrial(true);
        const data: StatusRequest = { type: 'status' };
        send(data);
    };

    const play = (keyword: string) => {
        const data: PlayRequest = { type: 'play', keyword };
        send(data);
    };

    const pause = () => {
        const data: PauseRequest = { type: 'pause' };
        send(data);
    };

    const resume = () => {
        const data: ResumeRequest = { type: 'resume' };
        send(data);
    };

    const stop = () => {
        const data: StopRequest = { type: 'stop' };
        send(data);
    };

    const seek = (position: string) => {
        const data: SeekRequest = { type: 'seek', position };
        send(data);
    };

    const skip = (mode: SkipMode) => {
        const data: SkipRequest = { type: 'skip', mode: (mode as string).toUpperCase() as SkipRequest['mode'] };
        send(data);
    };

    return {
        socket,
        status,
        requestStatus,
        play,
        pause,
        resume,
        stop,
        seek,
        skip
    };
};
