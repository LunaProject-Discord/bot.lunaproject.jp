import { atom } from 'recoil';
import { COOKIE_APPEARANCE } from '../utils/cookie';

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
