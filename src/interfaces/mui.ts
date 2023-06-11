import { PopoverProps as MuiPopoverProps, SxProps, Theme } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export interface StyledProps {
    sx?: SxProps<Theme>;
}

export interface PopoverProps extends Omit<MuiPopoverProps, 'open' | 'anchorEl'> {
    anchorEl: HTMLElement | null;
    setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}
