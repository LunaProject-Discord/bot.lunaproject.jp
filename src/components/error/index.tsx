'use client';

import { styled, TypographyProps } from '@mui/material';
import React from 'react';
import { TranslatableTypography } from '../text';

export const ErrorRoot = styled('div')(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(1)
}));

export const ErrorTitle = styled(
    (props: TypographyProps) => <TranslatableTypography variant="h4" align="center" {...props} />
)<TypographyProps>();

export const ErrorDescription = styled(
    (props: TypographyProps) => <TranslatableTypography variant="body1" align="center" {...props} />
)<TypographyProps>();
