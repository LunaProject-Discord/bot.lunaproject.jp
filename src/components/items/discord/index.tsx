'use client';

import { ListItemButton as MuiListItemButton, ListItemIcon as MuiListItemIcon, styled } from '@mui/material';

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
    width: `calc(100% - calc(${theme.spacing(1)} * 2)) !important`,
    padding: theme.spacing(.5, 1),
    left: `${theme.spacing(1)} !important`,
    gap: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('sm')]: {
        minHeight: theme.spacing(6),
        padding: theme.spacing(.5, 1.5),
        gap: theme.spacing(1.5)
    }
}));

export const ListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({
    minWidth: theme.spacing(3)
}));
