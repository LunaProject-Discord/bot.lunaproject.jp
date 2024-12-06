'use client';

import { codeStyled } from '@/components/text';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { TextareaAutosize, TextareaAutosizeProps } from '@mui/base';
import { Box, BoxProps, styled } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

export type EditorSaveState = 'success' | 'failed' | 'saving' | undefined;

export const editorClasses = generateComponentClasses(
    'Editor',
    [
        'root',
        'title',
        'content'
    ]
);

export const EditorRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(editorClasses.root, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    padding: theme.spacing(3, 0),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(12, 0),
        gap: theme.spacing(6)
    },
    [`& .${editorClasses.content}`]: {
        '&.ProseMirror, &.ProseMirror-focused': {
            outline: 'none',
            '&.resize-cursor': {
                cursor: ['ew-resize', 'col-resize']
            }
        },
        '& .ProseMirror-gapcursor::after': {
            borderTopColor: theme.vars.palette.text.primary
        },

        '& h2': {
            ...theme.typography.h2,
            scrollMarginTop: theme.spacing(3),
            '&:not(:last-child)': {
                marginBottom: '.35em'
            },
            [theme.breakpoints.up('md')]: {
                scrollMarginTop: theme.spacing(12)
            }
        },
        '& h3': {
            ...theme.typography.h3,
            scrollMarginTop: theme.spacing(3),
            '&:not(:last-child)': {
                marginBottom: '.35em'
            },
            [theme.breakpoints.up('md')]: {
                scrollMarginTop: theme.spacing(12)
            }
        },
        '& h4': {
            ...theme.typography.h4,
            scrollMarginTop: theme.spacing(3),
            '&:not(:last-child)': {
                marginBottom: '.35em'
            },
            [theme.breakpoints.up('md')]: {
                scrollMarginTop: theme.spacing(12)
            }
        },
        '& p': {
            ...theme.typography.body1,
            '&:not(:last-child)': {
                marginBottom: '.35em'
            },
            '&.is-editor-empty:first-child::before': {
                content: 'attr(data-placeholder)',
                height: 0,
                float: 'left',
                pointerEvents: 'none',
                color: theme.vars.palette.text.disabled
            }
        },
        '& code': codeStyled(theme),
        '& a': {
            textDecoration: 'underline',
            color: theme.vars.palette.primary.main
        },
        '& ul': {
            marginLeft: '1.4rem',
            listStyleType: 'disc',
            '&:not(:last-child)': {
                marginBottom: '.35em'
            },
            '& > li > ul': {
                listStyleType: 'circle',
                '& > li > ul': {
                    listStyleType: 'square'
                }
            }
        },
        '& ol': {
            marginLeft: '1.4rem',
            listStyleType: 'decimal',
            '&:not(:last-child)': {
                marginBottom: '.35em'
            }
        },
        '& li:not(:last-child)': {
            marginBottom: '.35em'
        },
        '& .tableWrapper': {
            margin: '.35em 0',
            '& table': {
                '& td, & th': {
                    position: 'relative',
                    padding: theme.spacing(1, 1.5),
                    border: `solid 1px ${theme.vars.palette.divider}`,
                    '& > *': {
                        position: 'relative',
                        marginBottom: 0
                    }
                },
                '& th': {
                    backgroundColor: theme.vars.palette.grey[100],
                    ...theme.applyStyles('dark', {
                        backgroundColor: theme.vars.palette.grey[900]
                    })
                },
                '& .selectedCell::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    backgroundColor: theme.vars.palette.selection.main
                },
                '& .column-resize-handle': {
                    width: theme.spacing(.5),
                    position: 'absolute',
                    top: 0,
                    bottom: -2,
                    right: -2,
                    pointerEvents: 'none',
                    backgroundColor: theme.vars.palette.selection.main
                }
            }
        },
        '& blockquote': {
            paddingLeft: theme.spacing(2),
            position: 'relative',
            '&:not(:last-child)': {
                marginBottom: '.35em'
            },
            '&::before': {
                content: '""',
                width: theme.spacing(.5),
                position: 'absolute',
                inset: 0,
                backgroundColor: theme.vars.palette.divider,
                borderRadius: theme.shape.borderRadius
            },
            '& h2, & h3, & h4': {
                padding: theme.spacing(2, 0, 1.5)
            }
        },
        '& img, & video': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: theme.shape.borderRadius,
            '&:not(:last-child)': {
                marginBottom: '.35em'
            }
        }
    }
}));

export const EditorTitleInput = styled(
    ({ className, ...props }: TextareaAutosizeProps) => (
        <TextareaAutosize
            className={clsx(editorClasses.title, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    ...theme.typography.h1,
    width: '100%',
    resize: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    '&::placeholder': {
        color: theme.vars.palette.text.disabled
    }
}));

export * from './extensions';
export * from './header';
export * from './ribbon';
export * from './selection_menu';
export * from './sidebar';
