/// <reference path="../../node_modules/@lunaproject/web-core/src/@types/material.d.ts" />

import '@mui/material';

declare module '@mui/material/styles' {
    interface Palette {
        monotone: Palette['monotone'];
    }

    interface PaletteOptions {
        monotone?: PaletteOptions['monotone'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        monotone: true;
    }
}
