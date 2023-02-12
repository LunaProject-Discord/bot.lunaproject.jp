import { M_PLUS_Rounded_1c, Nunito } from '@next/font/google';

export const Font_Nunito = Nunito({
    weight: 'variable',
    style: ['normal', 'italic'],
    subsets: ['latin', 'latin-ext']
});

export const Font_M_Plus = M_PLUS_Rounded_1c({
    weight: ['100', '300', '400', '500', '700', '800', '900'],
    style: 'normal',
    preload: false
});

export const fontFamily = `${Font_Nunito.style.fontFamily}, ${Font_M_Plus.style.fontFamily}, 'Noto Color Emoji', sans-serif`;
