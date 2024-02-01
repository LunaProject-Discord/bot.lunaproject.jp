import { atom } from 'jotai';

export type AppearanceType = 'system' | 'light' | 'dark';

interface AppearanceState {
    appearance: AppearanceType;
    isDarkMode: boolean;
}

export const appearanceAtom = atom<AppearanceState>({
    appearance: 'system',
    isDarkMode: false
});
