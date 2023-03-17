'use client';

import { Dialog, dialogClasses, styled } from '@mui/material';
import { DIALOG_WIDTH } from '@mui/x-date-pickers/internals';

export const DatePickerModalDialog = styled(Dialog)({
    zIndex: 1600,
    [`& .${dialogClasses.container}`]: {
        outline: 0
    },
    [`& .${dialogClasses.paper}`]: {
        minWidth: DIALOG_WIDTH,
        outline: 0
    }
});
