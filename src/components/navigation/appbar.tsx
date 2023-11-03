'use client';

import { defaultPredicate, NavigationItemProps } from '@components/navigation/index';
import { RouteLink } from '@lunaproject-discord/web-core/dist/components/Link';
import { AppBar as MuiAppBar, AppBarProps, Button, styled, Toolbar as MuiToolbar } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

export const NavigationAppBar = styled(
    (props: AppBarProps) => <MuiAppBar position="fixed" color="default" elevation={0} {...props} />
)<AppBarProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[800],
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1
}));

export const NavigationToolbar = styled(MuiToolbar)(({ theme }) => ({
    width: '100%',
    maxWidth: theme.breakpoints.values.xl,
    margin: '0 auto',
    padding: `${theme.spacing(0, 1)} !important`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
        padding: `${theme.spacing(0, 3)} !important`
    }
}));

export interface NavigationToolbarItemProps extends Omit<NavigationItemProps, 'icon'> {
    children: ReactNode;
}

export const NavigationToolbarItem = (
    {
        href,
        predicate,
        children
    }: NavigationToolbarItemProps
) => {
    const pathname = usePathname();
    const loweredPathname = pathname.toLowerCase();
    const loweredHref = href.toLowerCase();
    const isMatch = (predicate ?? defaultPredicate)(loweredPathname, loweredHref);

    const color = isMatch ? 'primary' : 'inherit';

    return (
        <Button component={RouteLink} href={href} color={color}>
            {children}
        </Button>
    );
};
