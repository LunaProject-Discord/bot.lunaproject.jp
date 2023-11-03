import { atom } from 'recoil';

export type PopoverType = 'services' | 'notifications' | 'user';

interface PopoverState {
    type: PopoverType;
    anchorEl: HTMLElement;
}

export const popoverAtom = atom<PopoverState | undefined>({
    key: 'popover',
    default: undefined
});
