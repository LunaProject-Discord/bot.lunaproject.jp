'use client';

import { ButtonBase } from '@lunaproject/web-core/dist/components/ButtonBase';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { Box, BoxProps, ButtonBaseProps, styled, Typography, TypographyProps } from '@mui/material';
import clsx from 'clsx';

export const editorSelectButtonClasses = generateComponentClasses(
    'EditorSelectButton',
    [
        'root',
        'label',
        'content'
    ]
);

export const EditorSelectButton = styled(
    ({ className, ...props }: ButtonBaseProps) => (
        <ButtonBase
            className={clsx(editorSelectButtonClasses.root, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    margin: theme.spacing(0, -1),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(.5),
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(3)
    }
}));

export const EditorSelectButtonLabel = styled(
    ({ className, ...props }: TypographyProps) => (
        <Typography
            color="text.secondary"
            className={clsx(editorSelectButtonClasses.label, className)}
            {...props}
        />
    )
)({
    flexShrink: 0
});

export const EditorSelectButtonContent = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(editorSelectButtonClasses.content, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
        margin: theme.spacing(-.5, 0)
    }
}));

export * from './category';
export * from './tag';
