import { COOKIE_APPEARANCE } from '@utils/cookie';
import { atom } from 'recoil';

export type AppearanceType = 'system' | 'light' | 'dark';

interface AppearanceState {
    appearance: AppearanceType;
    isDarkMode: boolean;
}

export const appearanceAtom = atom<AppearanceState>({
    key: COOKIE_APPEARANCE,
    default: {
        appearance: 'system',
        isDarkMode: false
    }
});
