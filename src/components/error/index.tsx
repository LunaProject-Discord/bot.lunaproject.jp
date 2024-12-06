'use client';

import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { Box, BoxProps, styled, TypographyProps } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { TranslatableTypography } from '../text';

export const errorClasses = generateComponentClasses(
    'Error',
    [
        'root',
        'title',
        'description'
    ]
);

export const ErrorRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(errorClasses.root, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(1)
}));

export const ErrorTitle = styled(
    ({ className, ...props }: TypographyProps) => (
        <TranslatableTypography
            variant="h2"
            align="center"
            className={clsx(errorClasses.title, className)}
            {...props}
        />
    )
)<TypographyProps>();

export const ErrorDescription = styled(
    ({ className, ...props }: TypographyProps) => (
        <TranslatableTypography
            align="center"
            className={clsx(errorClasses.description, className)}
            {...props}
        />
    )
)<TypographyProps>();
