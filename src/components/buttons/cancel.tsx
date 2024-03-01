import { CloseIcon } from '@/components/icons';
import { Key } from '@/components/text';
import { Button, buttonClasses, ButtonProps } from '@mui/material';
import React from 'react';
import { isMacOs } from 'react-device-detect';

export const CancelButton = ({ children, variant, sx, ...props }: ButtonProps) => {
    const defaultSx = variant !== 'contained' ? {
        gap: .5,
        [`& .${buttonClasses.startIcon}, & .${buttonClasses.endIcon}`]: {
            m: 0
        }
    } : {};

    return (
        <Button variant={variant} startIcon={<CloseIcon />} sx={{ ...defaultSx, ...sx }} {...props}>
            {children}
            <Key sx={{ ml: variant === 'contained' ? 1 : .5, mr: variant === 'contained' ? -.5 : 0 }}>
                {isMacOs ? '⎋' : 'Esc'}
            </Key>
        </Button>
    );
};
