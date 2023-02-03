'use client';

import { Box, styled } from '@mui/material';
import { Property } from 'csstype';

export const Body = styled('body')(({ theme }) => ({
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    [theme.breakpoints.up('md')]: {
        maxWidth: 1400
    }
}));

export const PageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.down('md')]: {
        marginBottom: 56
    },
    [theme.breakpoints.up('md')]: {
        marginLeft: 56
    }
}));

interface Props {
    position?: Property.Position | undefined;
    display?: Property.Display | undefined;
}

export const PageContent = styled(
    'main',
    { shouldForwardProp: (prop) => prop !== 'sx' && prop !== 'position' && prop !== 'display' }
)<Props>(({ theme, position, display }) => ({
    width: '100%',
    minHeight: '100vh',
    padding: theme.spacing(3),
    position: position ?? 'static',
    display: display ?? 'block',
    flexDirection: 'column',
    gap: theme.spacing(3)
}));

export const PageHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    userSelect: 'none',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch'
    }
}));
