'use client';

import {
    Drawer,
    drawerClasses,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListProps,
    ListSubheader,
    styled,
    svgIconClasses
} from '@mui/material';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { Dispatch, MouseEvent, ReactNode, SetStateAction } from 'react';
import { defaultPredicate, NavigationItemProps } from './index';

export const NAVIGATION_DRAWER_WIDTH = 280;

export const NavigationRoot = styled('nav')(({ theme }) => ({
    width: NAVIGATION_DRAWER_WIDTH,
    height: 'fit-content',
    position: 'sticky',
    // ヘッダーの高さ + ページレイアウトのパディング上
    top: `calc(${theme.spacing(7)} + ${theme.spacing(3)})`,
    display: 'none',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
        // ヘッダーの高さ + ページレイアウトのパディング上
        top: `calc(${theme.spacing(8)} + ${theme.spacing(3)})`
    },
    [theme.breakpoints.up('md')]: {
        display: 'block'
    }
}));

export interface NavigationDrawerProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavigationDrawer = styled(Drawer)(({ theme }) => ({
    [`&.${drawerClasses.modal}`]: {
        zIndex: theme.zIndex.drawer + 1
    },
    [`& .${drawerClasses.paper}`]: {
        width: NAVIGATION_DRAWER_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        overflow: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
        border: 'none',
        backgroundImage: 'none',
        [theme.breakpoints.up('md')]: {
            // 表示範囲の高さ - (ヘッダーの高さ + (ページレイアウトのパディング上 + ページレイアウトのパディング下))
            maxHeight: `calc(100dvh - calc(${theme.spacing(8)} + calc(${theme.spacing(3)} + ${theme.spacing(3)})))`,
            position: 'static'
        }
    }
}));

export const NavigationDrawerContent = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    overflow: 'auto',
    overflowX: 'hidden',
    overscrollBehavior: 'contain'
}));

export const NavigationDrawerGroupRoot = styled(List)(({ theme }) => ({
    padding: theme.spacing(0, 1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(.5),
    '&:last-child': {
        paddingBottom: theme.spacing(1)
    },
    [theme.breakpoints.up('md')]: {
        padding: 0
    }
}));

export const NavigationDrawerGroupLabel = styled(ListSubheader)(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    lineHeight: 'unset',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: theme.palette.text.primary
}));

export interface NavigationDrawerGroupProps extends Omit<ListProps, 'subheader'> {
    label?: ReactNode;
    children: ReactNode;
}

export const NavigationDrawerGroup = ({ label, children, ...props }: NavigationDrawerGroupProps) => (
    <NavigationDrawerGroupRoot
        subheader={label ? (<NavigationDrawerGroupLabel>{label}</NavigationDrawerGroupLabel>) : undefined}
        {...props}
    >
        {children}
    </NavigationDrawerGroupRoot>
);

export interface NavigationDrawerItemProps extends NavigationDrawerProps, NavigationItemProps {
    primary?: ReactNode;
    secondary?: ReactNode;
}

export const NavigationDrawerItem = (
    {
        href,
        predicate,
        icon,
        primary,
        secondary,
        setOpen
    }: NavigationDrawerItemProps
) => {
    const router = useRouter();

    const pathname = usePathname();
    const loweredPathname = pathname.toLowerCase();
    const loweredHref = href.toLowerCase();
    const isMatch = (predicate ?? defaultPredicate)(loweredPathname, loweredHref);

    const color = isMatch ? 'primary.main' : 'text.secondary';

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.push(href);
        setOpen(false);
    };

    return (
        <ListItemButton
            component={NextLink}
            href={href}
            selected={isMatch}
            onClick={handleClick}
            sx={{ px: 1.5, py: .5, gap: 1, borderRadius: 1 }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 20,
                    color,
                    [`& .${svgIconClasses.root}`]: {
                        fontSize: (theme) => theme.typography.h6.fontSize
                    }
                }}
            >
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={primary}
                primaryTypographyProps={{
                    fontSize: (theme) => theme.typography.body2.fontSize,
                    fontWeight: (theme) => theme.typography.fontWeightMedium,
                    color
                }}
                secondary={secondary}
                secondaryTypographyProps={{ color }}
            />
        </ListItemButton>
    );
};
