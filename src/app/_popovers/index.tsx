'use client';

import { LocalizationProps } from '@interfaces/localization';
import { CheckOutlined } from '@mui/icons-material';
import {
    ListItemButton as MuiListItemButton,
    ListItemButtonProps,
    ListItemIcon as MuiListItemIcon,
    ListItemText,
    styled
} from '@mui/material';
import NextLink, { LinkProps } from 'next/link';
import React, { ReactNode } from 'react';

export interface PopoverProps extends LocalizationProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

export const PopoverListItemButton = styled(MuiListItemButton)(({ theme }) => ({
    padding: theme.spacing(.5, 1.5),
    gap: theme.spacing(1.5)
}));

type PopoverListItemLinkButtonProps = ListItemButtonProps & LinkProps;

export const PopoverListItemLinkButton = styled(
    (props) => <MuiListItemButton component={NextLink} href="" {...props} />
)<PopoverListItemLinkButtonProps>(({ theme }) => ({
    padding: theme.spacing(.5, 1.5),
    gap: theme.spacing(1.5)
}));

interface PopoverListItemSwitchProps extends ListItemButtonProps {
    checked: boolean;
    primary: ReactNode;
    secondary?: ReactNode;
}

export const PopoverListItemSwitch = ({ checked, primary, secondary, ...props }: PopoverListItemSwitchProps) => (
    <PopoverListItemButton dense {...props}>
        <PopoverListItemIcon>
            {checked && <CheckOutlined />}
        </PopoverListItemIcon>
        <ListItemText primary={primary} secondary={secondary} />
    </PopoverListItemButton>
);

export const PopoverListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({
    minWidth: theme.spacing(3)
}));

export * from './user';
