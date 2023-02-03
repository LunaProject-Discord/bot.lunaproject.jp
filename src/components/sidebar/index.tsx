'use client';

import { Drawer, styled } from '@mui/material';

export const Sidebar = styled(Drawer)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `solid 1px ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));
