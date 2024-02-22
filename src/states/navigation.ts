import { atom } from 'jotai';

interface NavigationState {
    disableElevation: boolean;
}

export const navigationAtom = atom<NavigationState>({
    disableElevation: false
});
