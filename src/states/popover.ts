import { atom } from 'jotai';

export type PopoverType = 'services' | 'notifications' | 'user';

export interface PopoverState {
    type: PopoverType;
    anchorEl: HTMLElement;
}

export interface ServicesPopoverState extends PopoverState {
    type: 'services';
}

export type UserPopoverContentType = 'appearance' | 'locale' | undefined;

export interface UserPopoverState extends PopoverState {
    type: 'user';
    state: UserPopoverContentType;
}

export const popoverAtom = atom<ServicesPopoverState | UserPopoverState | undefined>(undefined);
