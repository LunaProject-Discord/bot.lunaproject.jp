import type { Appearance } from './Appearance';
import type { ColorTheme } from './ColorTheme';

export interface Theme extends ColorTheme {
    appearance: Appearance;
}
