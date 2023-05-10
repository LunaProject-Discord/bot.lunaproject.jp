import { PopoverProps as MuiPopoverProps } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export interface PopoverProps extends Omit<MuiPopoverProps, 'open' | 'anchorEl'> {
    anchorEl: HTMLElement | null;
    setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}
