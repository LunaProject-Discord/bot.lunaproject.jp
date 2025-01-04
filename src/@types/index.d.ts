/// <reference path="../../node_modules/@lunaproject/web-core/dist/@types/material.d.ts" />
/// <reference path="../../node_modules/@lunaproject/web-discord/dist/@types/theme.d.ts" />

import '@mui/system';
import { ElementType } from 'react';

declare module '@mui/system' {
    interface BoxOwnProps {
        component?: ElementType;
    }
}
