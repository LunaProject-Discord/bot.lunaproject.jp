'use client';

import { useEffect, useRef } from 'react';

export interface WebSocketOptions {
    onOpen?: (e: Event) => void,
    onClose?: (e: CloseEvent) => void,
    onMessage?: (e: MessageEvent) => void,
    onError?: (e: Event) => void
}

export interface WebSocketHook {
    socket: WebSocket | undefined,
    send: <T = string>(data: T) => void
}

export const useWebSocket = (url: string, { onOpen, onClose, onMessage, onError }: WebSocketOptions): WebSocketHook => {
    const socket = useRef<WebSocket>();

    const send = <T = string>(data: T) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN)
            socket.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    };

    useEffect(() => {
        const webSocket = new WebSocket(url);

        if (onOpen)
            webSocket.addEventListener('open', onOpen);
        if (onClose)
            webSocket.addEventListener('close', onClose);
        if (onMessage)
            webSocket.addEventListener('message', onMessage);
        if (onError)
            webSocket.addEventListener('error', onError);

        socket.current = webSocket;

        return () => {
            if (onOpen)
                webSocket.removeEventListener('open', onOpen);
            if (onClose)
                webSocket.removeEventListener('close', onClose);
            if (onMessage)
                webSocket.removeEventListener('message', onMessage);
            if (onError)
                webSocket.removeEventListener('error', onError);

            webSocket.close();
            socket.current = undefined;
        };
    }, []);

    return {
        socket: socket.current,
        send
    };
};
