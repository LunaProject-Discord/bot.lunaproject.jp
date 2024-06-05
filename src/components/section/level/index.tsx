'use client';

import { LocalizationProps } from '@/interfaces/localization';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { Box, BoxProps, styled, Typography, TypographyProps } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

export const sectionLevelHeaderClasses = generateComponentClasses(
    'SectionLevelHeader',
    [
        'root',
        'profile',
        'rank',
        'status',
        'level',
        'experience'
    ]
);

export const SectionLevelHeaderRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionLevelHeaderClasses.root, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(0, 1.5),
    display: 'none',
    gridTemplateColumns: '32px 40px 1fr 10% 10%',
    gap: theme.spacing(1.5),
    [theme.breakpoints.up('md')]: {
        display: 'grid'
    },
    [`& .${sectionLevelHeaderClasses.profile}`]: {
        gridColumn: 3
    }
}));

export const SectionLevelHeaderItem = ({ children, ...props }: TypographyProps) => (
    <Typography variant="body2" color="text.secondary" {...props}>
        {children}
    </Typography>
);

export type SectionLevelHeaderProps = Omit<BoxProps, 'children'> & LocalizationProps;

export * from './edit';
export * from './view';
