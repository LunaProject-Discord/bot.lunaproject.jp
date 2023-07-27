import { atom } from 'recoil';

export const mediaPanelOpenAtom = atom<boolean>({
    key: 'media_panel_open',
    default: false
});

export const mediaWebSocketAtom = atom<WebSocket | undefined>({
    key: 'media_web_socket',
    default: undefined
});
