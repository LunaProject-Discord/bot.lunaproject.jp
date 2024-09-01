import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
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

export const appearanceClasses = generateComponentClasses(
    'Appearance',
    [
        'root',
        'light',
        'dark'
    ]
);
