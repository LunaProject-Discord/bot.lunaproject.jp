import { useSyncExternalStore } from 'react';

export const useLoginUrl = () => {
    const path = useSyncExternalStore<string>(
        () => () => {
        },
        () => `?redirect=${encodeURIComponent(window.location.href)}`,
        () => ''
    );

    return `https://account.lunaproject.jp/login${path}`;
};
