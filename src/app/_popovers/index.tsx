'use client';

import { CheckIcon } from '@/components/icons';
import {
    CSSObject,
    Link,
    LinkProps,
    ListItemButton as MuiListItemButton,
    ListItemButtonProps,
    ListItemIcon as MuiListItemIcon,
    ListItemText,
    styled,
    Theme
} from '@mui/material';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React, { ReactNode } from 'react';

const popoverListItemButtonStyled = (theme: Theme): CSSObject => ({
    minHeight: theme.spacing(5),
    padding: theme.spacing(.5, 1.5),
    gap: theme.spacing(1.5)
});

export const PopoverListItemButton = styled(MuiListItemButton)(({ theme }) => popoverListItemButtonStyled(theme));

export type PopoverListItemLinkButtonProps = ListItemButtonProps & LinkProps;

export const PopoverListItemLinkButton = styled(
    (props) => <MuiListItemButton component={Link} href="" {...props} />
)<PopoverListItemLinkButtonProps>(({ theme }) => popoverListItemButtonStyled(theme));

export type PopoverListItemRouteLinkButtonProps = ListItemButtonProps & LinkProps & NextLinkProps;

export const PopoverListItemRouteLinkButton = styled(
    (props) => <MuiListItemButton component={NextLink} href="" {...props} />
)<PopoverListItemRouteLinkButtonProps>(({ theme }) => popoverListItemButtonStyled(theme));

interface PopoverListItemSwitchProps extends ListItemButtonProps {
    checked: boolean;
    primary: ReactNode;
    secondary?: ReactNode;
}

export const PopoverListItemSwitch = ({ checked, primary, secondary, ...props }: PopoverListItemSwitchProps) => (
    <PopoverListItemButton {...props}>
        <PopoverListItemIcon>
            {checked && <CheckIcon />}
        </PopoverListItemIcon>
        <ListItemText primary={primary} secondary={secondary} />
    </PopoverListItemButton>
);

export const PopoverListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({
    minWidth: theme.spacing(3)
}));

export * from './services';
export * from './user';
