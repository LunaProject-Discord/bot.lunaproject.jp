'use client';

import { MonospaceFontFamily } from '@/app/theme';
import { codeStyled } from '@/components/text';
import { LocalizationProps } from '@/interfaces/localization';
import { generateComponentClasses, MuiDarkTheme } from '@lunaproject/web-core/dist/utils';
import { TextareaAutosize, TextareaAutosizeProps } from '@mui/base';
import { Box, BoxProps, checkboxClasses, CSSObject, styled, Theme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import clsx from 'clsx';
import React from 'react';

export const editorClasses = generateComponentClasses(
    'Editor',
    [
        'root',
        'thumbnail',
        'title',
        'content'
    ]
);

export const editorProseMirrorClasses = generateComponentClasses(
    'ProseMirror',
    [
        'focused',
        'selectednode',
        'gapcursor'
    ]
);

const editorRootPlaceholderStyled = (theme: Theme) => (placeholder: string): CSSObject => ({
    '&:not(&:where(tr *))': {
        '&.is-empty': {
            position: 'relative',
            '&::before': {
                content: `"${placeholder.replaceAll('"', '\\"')}"`,
                height: 0,
                position: 'absolute',
                left: 0,
                right: 0,
                pointerEvents: 'none',
                textAlign: 'inherit',
                color: theme.vars.palette.text.disabled
            }
        }
    }
});

export const EditorRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            component="article"
            className={clsx(editorClasses.root, className)}
            {...props}
        />
    )
)<LocalizationProps>(({ theme, localization: { translations } }) => {
    const placeholderStyled = editorRootPlaceholderStyled(theme);

    return {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        [`&:has(.${editorClasses.content}[contenteditable="true"])`]: {
            padding: theme.spacing(3, 0),
            gap: theme.spacing(3),
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(12, 0),
                gap: theme.spacing(6)
            }
        },
        [`&:has(.${editorClasses.content}[contenteditable="false"])`]: {
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(3),
                gap: theme.spacing(3),
                border: `solid 1px ${theme.vars.palette.divider}`,
                borderRadius: theme.shape.borderRadius
            }
        },
        [`& .${editorClasses.content}`]: {
            [`&.ProseMirror, &.${editorProseMirrorClasses.focused}`]: {
                outline: 'none',
                '&.resize-cursor': {
                    cursor: ['ew-resize', 'col-resize']
                }
            },
            [`& .${editorProseMirrorClasses.gapcursor}::after`]: {
                borderTopColor: theme.vars.palette.text.primary
            },

            // プレースホルダー
            '& figure.is-empty figcaption::before': {
                content: `"${translations.web_page_editor_content_placeholder_caption}"`,
                height: 0,
                float: 'left',
                pointerEvents: 'none',
                color: theme.vars.palette.text.disabled
            },

            // ブロック
            '& p': {
                ...theme.typography.body1,
                ...placeholderStyled(translations.web_page_editor_content_placeholder_paragraph as string),
                '&:not(:last-child)': {
                    marginBottom: '.35em'
                },
                '&:where(li *)': {
                    ...placeholderStyled(translations.web_page_editor_content_placeholder_list_item as string)
                }
            },
            '& h2, & h3, & h4': {
                ...placeholderStyled(translations.web_page_editor_content_placeholder_heading as string),
                '&:not(:last-child)': {
                    marginBottom: '.35em'
                }
            },
            '& h2': theme.typography.h2,
            '& h3': theme.typography.h3,
            '& h4': theme.typography.h4,
            '& ul': {
                marginLeft: '1.4rem',
                listStyleType: 'disc',
                '&:not(:last-child)': {
                    marginBottom: '.35em'
                },
                '&[data-type="taskList"]': {
                    marginLeft: 0,
                    listStyleType: 'none'
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
            '& li': {
                '&:not(:last-child)': {
                    marginBottom: '.35em'
                },
                '&.react-renderer.node-taskItem': {
                    '& [data-node-view-wrapper]': {
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing(.5)
                    },
                    [`& .${checkboxClasses.root}`]: {
                        padding: 0
                    }
                }
            },
            '& table': {
                margin: '.35em 0',
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
                    bottom: theme.spacing(-.25),
                    right: theme.spacing(-.25),
                    pointerEvents: 'none',
                    backgroundColor: theme.vars.palette.selection.main
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
            '& hr': {
                borderColor: theme.vars.palette.divider,
                '&:not(:last-child)': {
                    marginBottom: '.35em'
                }
            },
            '& pre': {
                '--mui-palette-selection-main': MuiDarkTheme.palette.selection.main,

                padding: theme.spacing(1),
                fontFamily: MonospaceFontFamily,
                fontSize: theme.typography.body2.fontSize,
                color: theme.vars.palette.common.white,
                backgroundColor: blueGrey[900],
                borderRadius: theme.shape.borderRadius,
                '&:not(:last-child)': {
                    marginBottom: '.35rem'
                },
                '&:has(code[class^="language-"])': {
                    color: '#e1e4e8'
                },
                '& code, & span': {
                    margin: 0,
                    padding: 0,
                    userSelect: 'auto',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    backgroundColor: 'unset',
                    border: 'unset',
                    borderRadius: 'unset'
                }
                /*
                '& code': {
                    counterReset: 'line',
                    counterIncrement: 'line 0',
                    '& .line::before': {
                        content: 'counter(line)',
                        counterIncrement: 'line',
                        width: '1rem',
                        marginRight: '1.5rem',
                        display: 'inline-block',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                        textAlign: 'right',
                        color: theme.vars.palette.text.secondary
                    }
                }
                */
            },
            /*
            '& .codeblock': {
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: '1fr',
                '& pre': {
                    gridColumn: 1,
                    gridRow: 1,
                    fontFamily: MonospaceFontFamily,
                    fontSize: theme.typography.body2.fontSize,
                    '& code, & span, & [data-node-view-content-react]': {
                        margin: 0,
                        padding: 0,
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        backgroundColor: 'unset',
                        border: 'unset',
                        borderRadius: 'unset'
                    },
                    '& [data-node-view-content-react]': {
                        color: 'transparent',
                        backgroundColor: 'transparent',
                        caretColor: theme.vars.palette.text.primary
                    }
                }
            },
            */
            '& img, & video, & audio, & iframe': {
                maxWidth: '100%',
                width: '100%',
                outline: 'none',
                '&:not(:last-child)': {
                    marginBottom: '.35em'
                },
                [`&.${editorProseMirrorClasses.selectednode}, .${editorProseMirrorClasses.selectednode} > &`]: {
                    outline: `solid ${theme.spacing(.5)} ${theme.vars.palette.selection.main}`
                }
            },
            '& img, & video': {
                height: 'auto',
                borderRadius: theme.shape.borderRadius
            },
            '& iframe[src^="https://www.youtube.com/embed/"], & iframe[src^="https://embed.nicovideo.jp/watch/"]': {
                height: 'auto',
                aspectRatio: '16 / 9',
                borderRadius: theme.shape.borderRadius
            },
            '& figure': {
                // position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(.5),
                cursor: 'default',
                '&:not(:last-child)': {
                    marginBottom: '.35em'
                },
                /*
                '&::before': {
                    content: '""',
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                    position: 'absolute',
                    top: theme.spacing(1),
                    left: theme.spacing(1),
                    maskImage: `url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960"><path d="M349.91-160q-28.91 0-49.41-20.59-20.5-20.59-20.5-49.5t20.59-49.41q20.59-20.5 49.5-20.5t49.41 20.59q20.5 20.59 20.5 49.5t-20.59 49.41q-20.59 20.5-49.5 20.5Zm260 0q-28.91 0-49.41-20.59-20.5-20.59-20.5-49.5t20.59-49.41q20.59-20.5 49.5-20.5t49.41 20.59q20.5 20.59 20.5 49.5t-20.59 49.41q-20.59 20.5-49.5 20.5Zm-260-250q-28.91 0-49.41-20.59-20.5-20.59-20.5-49.5t20.59-49.41q20.59-20.5 49.5-20.5t49.41 20.59q20.5 20.59 20.5 49.5t-20.59 49.41q-20.59 20.5-49.5 20.5Zm260 0q-28.91 0-49.41-20.59-20.5-20.59-20.5-49.5t20.59-49.41q20.59-20.5 49.5-20.5t49.41 20.59q20.5 20.59 20.5 49.5t-20.59 49.41q-20.59 20.5-49.5 20.5Zm-260-250q-28.91 0-49.41-20.59-20.5-20.59-20.5-49.5t20.59-49.41q20.59-20.5 49.5-20.5t49.41 20.59q20.5 20.59 20.5 49.5t-20.59 49.41q-20.59 20.5-49.5 20.5Zm260 0q-28.91 0-49.41-20.59-20.5-20.59-20.5-49.5t20.59-49.41q20.59-20.5 49.5-20.5t49.41 20.59q20.5 20.59 20.5 49.5t-20.59 49.41q-20.59 20.5-49.5 20.5Z" /></svg>')`,
                    maskRepeat: 'no-repeat',
                    maskSize: theme.spacing(4),
                    maskPosition: 'center',
                    backgroundColor: theme.vars.palette.common.white
                },
                */
                '& img, & video, & audio, & iframe': {
                    '&:not(:last-child)': {
                        marginBottom: 0
                    }
                },
                '& figcaption': {
                    ...theme.typography.body2,
                    cursor: 'text',
                    color: theme.vars.palette.text.secondary
                }
            },

            // マーク
            '& code': codeStyled(theme),
            '& a': {
                textDecoration: 'underline',
                color: theme.vars.palette.primary.main
            },

            '&[contenteditable="true"]': {
                '& h2, & h3, & h4': {
                    scrollMarginTop: theme.spacing(3),
                    [theme.breakpoints.up('md')]: {
                        scrollMarginTop: theme.spacing(12)
                    }
                },
                '& figure': {
                    '& img, & video, & audio': {
                        // pointerEvents: 'none',
                        WebkitUserDrag: 'none',
                        userDrag: 'none',
                        cursor: 'default'
                    }
                }
            },
            '&[contenteditable="false"]': {
                '& h2, & h3, & h4': {
                    // グローバル ヘッダー: 56px, ローカル ヘッダー: 48px, マージン: 16px
                    scrollMarginTop: theme.spacing(7 + 6 + 2),
                    [theme.breakpoints.up('sm')]: {
                        // グローバル ヘッダー: 64px, ローカル ヘッダー: 48px, マージン: 16px
                        scrollMarginTop: theme.spacing(8 + 6 + 2)
                    }
                },
                '& li.react-renderer.node-taskItem': {
                    [`& .${checkboxClasses.root}`]: {
                        cursor: 'default'
                    }
                }
            }
        }
    };
});

export const EditorThumbnail = styled(
    ({ className, ...props }: BoxProps<'img'>) => (
        <Box
            component="img"
            className={clsx(editorClasses.thumbnail, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
        width: `calc(100% + calc(${theme.spacing(3)} * 2))`,
        maxWidth: 'none',
        margin: theme.spacing(-3, -3, 0),
        borderRadius: theme.spacing(.375, .375, 0, 0)
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

export * from './aside';
export * from './header';
export * from './selection_menu';
export * from './sidebar';
