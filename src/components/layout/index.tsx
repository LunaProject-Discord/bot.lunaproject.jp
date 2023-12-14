'use client';

import { styled } from '@mui/material';
import { Property } from 'csstype';

interface Props {
    position?: Property.Position | undefined;
    display?: Property.Display | undefined;
}

export const PageContent = styled(
    'main',
    { shouldForwardProp: (prop) => prop !== 'sx' && prop !== 'position' && prop !== 'display' }
)<Props>(({ theme, position, display }) => ({
    width: '100%',
    minHeight: '100dvh',
    padding: theme.spacing(3),
    position: position ?? 'static',
    display: display ?? 'block',
    flexDirection: 'column',
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
        maxWidth: 1200,
        margin: '0 auto'
    }
}));
