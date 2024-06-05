'use client';

import { CloseIcon } from '@/components/icons';
import { Key } from '@/components/text';
import { Button, ButtonRootProps } from '@lunaproject/web-core/dist/components';
import { ButtonProps } from '@mui/material';
import React from 'react';
import { isMacOs } from 'react-device-detect';

export const CancelButton = (
    {
        children,
        variant,
        corners,
        ...props
    }: ButtonRootProps & ButtonProps
) => {
    return (
        <Button variant={variant} corners={corners} startIcon={<CloseIcon />} {...props}>
            {children}
            <Key sx={{ ml: 1, mr: -.5 }}>
                {isMacOs ? '⎋' : 'Esc'}
            </Key>
        </Button>
    );
};
