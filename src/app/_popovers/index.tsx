'use client';

import { LocalizationProps } from '@interfaces/localization';
import { Link } from '@lunaproject/web-core/dist/components';
import { RouteLink } from '@lunaproject/web-core/dist/components/Link';
import { CheckOutlined } from '@mui/icons-material';
import {
    LinkProps,
    ListItemButton as MuiListItemButton,
    ListItemButtonProps,
    ListItemIcon as MuiListItemIcon,
    ListItemText,
    styled
} from '@mui/material';
import { LinkProps as NextLinkProps } from 'next/link';
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
    (props) => <MuiListItemButton component={Link} href="" {...props} />
)<PopoverListItemLinkButtonProps>(({ theme }) => ({
    padding: theme.spacing(.5, 1.5),
    gap: theme.spacing(1.5)
}));

export type PopoverListItemRouteLinkButtonProps = ListItemButtonProps & LinkProps & NextLinkProps;

export const PopoverListItemRouteLinkButton = styled(
    (props) => <MuiListItemButton component={RouteLink} href="" {...props} />
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

export * from './services';
export * from './user';
