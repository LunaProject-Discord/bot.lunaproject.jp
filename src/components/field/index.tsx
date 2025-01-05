'use client';

import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { Box, BoxProps, styled, Typography, TypographyProps } from '@mui/material';
import clsx from 'clsx';

export const fieldClasses = generateComponentClasses(
    'Field',
    [
        'root',
        'label',
        'required'
    ]
);

export const Field = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(fieldClasses.root, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(.5)
}));

export const FieldLabel = ({ className, ...props }: TypographyProps<'label'>) => (
    <Typography
        component="label"
        className={clsx(fieldClasses.label, className)}
        {...props}
    />
);

export const FieldRequired = ({ className, sx, ...props }: TypographyProps) => (
    <Typography
        component="span"
        color="error.main"
        className={clsx(fieldClasses.required, className)}
        sx={{ ml: .5, ...sx }}
        {...props}
    >
        *
    </Typography>
);

export * from './color';
