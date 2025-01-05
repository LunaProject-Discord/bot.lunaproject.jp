import { LocalizationProps } from '@/interfaces/localization';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { Box, BoxProps, styled } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

export type EditorSidebarProps = LocalizationProps;

export const editorSidebarClasses = generateComponentClasses(
    'EditorSidebar',
    [
        'root',
        'header',
        'content'
    ]
);

export const EditorSidebarHeader = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            component="header"
            className={clsx(editorSidebarClasses.header, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    padding: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
}));

export const EditorSidebarContent = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(editorSidebarClasses.content, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    overflowY: 'auto'
}));

export * from './navigation';
export * from './publish';
