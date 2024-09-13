'use client';

import { Box, styled, TypographyProps } from '@mui/material';
import React from 'react';
import { TranslatableTypography } from '../text';

export const ErrorRoot = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(1)
}));

export const ErrorTitle = styled(
    (props: TypographyProps) => <TranslatableTypography variant="h2" align="center" {...props} />
)<TypographyProps>();

export const ErrorDescription = styled(
    (props: TypographyProps) => <TranslatableTypography align="center" {...props} />
)<TypographyProps>();
