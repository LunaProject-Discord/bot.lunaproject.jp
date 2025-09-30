'use client';

import { editorProseMirrorClasses } from '@/components/editor';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import {
    blockquoteClasses,
    BlockquoteContentElement,
    BlockquoteDividerElement,
    BlockquoteRootElement,
    blockquoteStyles,
    boldClasses,
    BoldElement,
    boldStyles,
    bulletListClasses,
    BulletListElement,
    bulletListStyles,
    DefaultDarkTheme,
    DefaultLightTheme,
    emojiClasses,
    headingClasses,
    headingStyles,
    italicClasses,
    ItalicElement,
    italicStyles,
    linkClasses,
    LinkElement,
    linkStyles,
    listItemClasses,
    ListItemElement,
    listItemStyles,
    messageAccessoriesClasses,
    MessageAccessoriesRootElement,
    messageAccessoriesStyles,
    messageClasses,
    messageContentClasses,
    MessageContentElement,
    messageContentStyles,
    messageEmbedAuthorClasses,
    MessageEmbedAuthorIconElement,
    MessageEmbedAuthorNameElement,
    MessageEmbedAuthorRootElement,
    messageEmbedAuthorStyles,
    messageEmbedClasses,
    MessageEmbedDescriptionElement,
    messageEmbedFieldClasses,
    MessageEmbedFieldNameElement,
    MessageEmbedFieldRootElement,
    MessageEmbedFieldsElement,
    messageEmbedFieldStyles,
    MessageEmbedFieldValueElement,
    messageEmbedFooterClasses,
    MessageEmbedFooterIconElement,
    MessageEmbedFooterRootElement,
    MessageEmbedFooterSeparatorElement,
    messageEmbedFooterStyles,
    MessageEmbedFooterTextElement,
    MessageEmbedGalleryCellElement,
    messageEmbedGalleryClasses,
    MessageEmbedGalleryImageElement,
    MessageEmbedGalleryRootElement,
    messageEmbedGalleryStyles,
    messageEmbedImageClasses,
    MessageEmbedImageElement,
    messageEmbedImageStyles,
    MessageEmbedRootElement,
    messageEmbedStyles,
    messageEmbedThumbnailClasses,
    MessageEmbedThumbnailImageElement,
    MessageEmbedThumbnailRootElement,
    messageEmbedThumbnailStyles,
    MessageEmbedTitleElement,
    MessageHeaderAvatarElement,
    messageHeaderClasses,
    MessageHeaderNameElement,
    MessageHeaderRootElement,
    messageHeaderStyles,
    MessageHeaderTimestampElement,
    MessageRootElement,
    messagesClasses,
    MessagesRootElement,
    messagesStyles,
    messageStyles,
    orderedListClasses,
    OrderedListElement,
    orderedListStyles,
    placeholderClasses,
    PlaceholderElement,
    strikethroughClasses,
    StrikethroughElement,
    strikethroughStyles,
    ThemeCSSVariableValues,
    underlineClasses,
    UnderlineElement,
    underlineStyles
} from '@lunaproject/web-discord-components';
import { Box, BoxProps, styled } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import '../../../../../public/fonts/noto-sans-jp/style.css';
import '../../../../../public/fonts/noto-sans/style.css';

export const messageEditorClasses = generateComponentClasses(
    'MessageEditor',
    [
        'root',
        'input'
    ]
);

export const MessageEditorRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            component="article"
            className={clsx(messageEditorClasses.root, className)}
            {...props}
        />
    )
)({
    [`& .${editorProseMirrorClasses.dropCursorBlock}, & .${editorProseMirrorClasses.dropCursorInline}`]: {
        backgroundColor: `${DefaultDarkTheme.palette.text.primary} !important`
    },
    [`&:has(.${messagesClasses.colorLight})`]: {
        [`& .${editorProseMirrorClasses.dropCursorBlock}, & .${editorProseMirrorClasses.dropCursorInline}`]: {
            backgroundColor: `${DefaultLightTheme.palette.text.primary} !important`
        }
    },
    [`& .${messageEditorClasses.input}`]: {
        [`&.ProseMirror, &.${editorProseMirrorClasses.focused}`]: {
            outline: 'none',
            '&.resize-cursor': {
                cursor: ['ew-resize', 'col-resize']
            }
        },
        [`& .${editorProseMirrorClasses.selection}`]: {
            textShadow: 'none',
            backgroundColor: ThemeCSSVariableValues.palette.background.selection
        },
        [`& .${editorProseMirrorClasses.gapCursor}::after`]: {
            borderTopColor: ThemeCSSVariableValues.palette.text.primary
        },

        // レイアウト
        [`& ${MessagesRootElement}.${messagesClasses.root}`]: {
            ...messagesStyles.root,
            overflowY: 'scroll',
            [`&.${messagesClasses.colorDark}`]: messagesStyles.colorDark,
            [`&.${messagesClasses.colorLight}`]: messagesStyles.colorLight,
            [`&.${messagesClasses.displayCozy}`]: messagesStyles.displayCozy,
            [`&.${messagesClasses.displayCompact}`]: messagesStyles.displayCompact,
            [`& ${MessageRootElement}.${messageClasses.root}`]: {
                ...messageStyles.root,
                flexShrink: 0,
                [`& ${MessageHeaderRootElement}.${messageHeaderClasses.root}`]: {
                    ...messageHeaderStyles.root,
                    [`& ${MessageHeaderAvatarElement}.${messageHeaderClasses.avatar}`]: messageHeaderStyles.avatar,
                    [`& ${MessageHeaderNameElement}.${messageHeaderClasses.name}`]: {
                        ...messageHeaderStyles.name,
                        display: 'inline-block'
                    },
                    [`& ${MessageHeaderTimestampElement}.${messageHeaderClasses.timestamp}`]: messageHeaderStyles.timestamp
                },
                [`& ${MessageContentElement}.${messageContentClasses.root}`]: messageContentStyles.root,
                [`& ${MessageAccessoriesRootElement}.${messageAccessoriesClasses.root}`]: {
                    ...messageAccessoriesStyles.root,
                    [`& ${MessageEmbedRootElement}.${messageEmbedClasses.root}`]: {
                        ...messageEmbedStyles.root,
                        [`& ${MessageEmbedAuthorRootElement}.${messageEmbedAuthorClasses.root}`]: {
                            ...messageEmbedAuthorStyles.root,
                            [`& ${MessageEmbedAuthorIconElement}.${messageEmbedAuthorClasses.icon}`]: {
                                ...messageEmbedAuthorStyles.icon,
                                pointerEvents: 'none'
                            },
                            [`& ${MessageEmbedAuthorNameElement}.${messageEmbedAuthorClasses.name}`]: {
                                ...messageEmbedAuthorStyles.name,
                                minWidth: 1,
                                ['&[data-url]']: linkStyles.root
                            }
                        },
                        [`& ${MessageEmbedTitleElement}.${messageEmbedClasses.title}`]: {
                            ...messageEmbedStyles.title,
                            minWidth: 1,
                            ['&[data-url]']: linkStyles.root
                        },
                        [`& ${MessageEmbedDescriptionElement}.${messageEmbedClasses.description}`]: {
                            ...messageEmbedStyles.description,
                            minWidth: 1
                        },
                        [`& ${MessageEmbedFieldsElement}.${messageEmbedClasses.fields}`]: {
                            ...messageEmbedStyles.fields,
                            [`& ${MessageEmbedFieldRootElement}.${messageEmbedFieldClasses.root}`]: {
                                ...messageEmbedFieldStyles.root,
                                [`& ${MessageEmbedFieldNameElement}.${messageEmbedFieldClasses.name}`]: messageEmbedFieldStyles.name,
                                [`& ${MessageEmbedFieldValueElement}.${messageEmbedFieldClasses.value}`]: {
                                    ...messageEmbedFieldStyles.value,
                                    minWidth: 1
                                }
                            }
                        },
                        [`& ${MessageEmbedImageElement}.${messageEmbedImageClasses.root}`]: messageEmbedImageStyles.root,
                        [`& ${MessageEmbedGalleryRootElement}.${messageEmbedGalleryClasses.root}`]: {
                            ...messageEmbedGalleryStyles.root,
                            [`& ${MessageEmbedGalleryCellElement}.${messageEmbedGalleryClasses.cell}`]: {
                                ...messageEmbedGalleryStyles.cell,
                                [`& ${MessageEmbedGalleryImageElement}.${messageEmbedGalleryClasses.image}`]: messageEmbedGalleryStyles.image
                            },
                            [`&:has(> :nth-child(2):last-child) ${MessageEmbedGalleryCellElement}.${messageEmbedGalleryClasses.cell}`]: {
                                gridRow: 'span 2'
                            },
                            [`&:has(> :nth-child(3):last-child) ${MessageEmbedGalleryCellElement}.${messageEmbedGalleryClasses.cell}:first-child`]: {
                                gridRow: 'span 2'
                            }
                        },
                        [`& ${MessageEmbedThumbnailRootElement}.${messageEmbedThumbnailClasses.root}`]: {
                            ...messageEmbedThumbnailStyles.root,
                            [`& ${MessageEmbedThumbnailImageElement}.${messageEmbedThumbnailClasses.image}`]: messageEmbedThumbnailStyles.image,
                            [`&.${editorProseMirrorClasses.selectedNode} ${MessageEmbedThumbnailImageElement}.${messageEmbedThumbnailClasses.image}`]: {
                                outline: `solid 4px ${ThemeCSSVariableValues.palette.background.selection}`
                            }
                        },
                        [`& ${MessageEmbedFooterRootElement}.${messageEmbedFooterClasses.root}`]: {
                            ...messageEmbedFooterStyles.root,
                            [`& ${MessageEmbedFooterIconElement}.${messageEmbedFooterClasses.icon}`]: {
                                ...messageEmbedFooterStyles.icon,
                                pointerEvents: 'none'
                            },
                            [`& ${MessageEmbedFooterTextElement}.${messageEmbedFooterClasses.text}`]: {
                                ...messageEmbedFooterStyles.text,
                                minWidth: 1
                            },
                            [`& ${MessageEmbedFooterSeparatorElement}.${messageEmbedFooterClasses.separator}`]: {
                                ...messageEmbedFooterStyles.separator,
                                margin: '0 -4px'
                            }
                        }
                    }
                }
            }
        },

        // ブロック
        [`& .${headingClasses.root}`]: {
            ...headingStyles.root,
            [`&.${headingClasses.variantLarge}`]: headingStyles.variantLarge,
            [`&.${headingClasses.variantMedium}`]: headingStyles.variantMedium,
            [`&.${headingClasses.variantSmall}`]: headingStyles.variantSmall
        },
        [`& ${BulletListElement}.${bulletListClasses.root}`]: bulletListStyles.root,
        [`& ${OrderedListElement}.${orderedListClasses.root}`]: orderedListStyles.root,
        [`& ${ListItemElement}.${listItemClasses.root}`]: listItemStyles.root,
        [`& ${BlockquoteRootElement}.${blockquoteClasses.root}`]: {
            ...blockquoteStyles.root,
            [`& ${BlockquoteDividerElement}.${blockquoteClasses.divider}`]: blockquoteStyles.divider,
            [`& ${BlockquoteContentElement}.${blockquoteClasses.content}`]: {
                ...blockquoteStyles.content,
                minWidth: 1
            }
        },
        '& .node-unicodeEmoji': {
            width: '1.375em',
            height: '1.375em',
            display: 'inline-block',
            verticalAlign: 'bottom',
            [`& .${emojiClasses.root}`]: {
                display: 'block'
            }
        },
        [`& ${PlaceholderElement}.${placeholderClasses.root}`]: {
            padding: '0 2px',
            textIndent: 0,
            backgroundColor: '#404147',
            borderRadius: 3,
            [`.${messagesClasses.colorLight} &, &:where(.${messagesClasses.colorLight} *)`]: {
                backgroundColor: '#e1e2e4'
            }
        },

        // マーク
        [`& strong, & ${BoldElement}.${boldClasses.root}`]: boldStyles.root,
        [`& em, & ${ItalicElement}.${italicClasses.root}`]: italicStyles.root,
        [`& u, & ${UnderlineElement}.${underlineClasses.root}`]: underlineStyles.root,
        [`& s, & ${StrikethroughElement}.${strikethroughClasses.root}`]: strikethroughStyles.root,
        [`& ${LinkElement}.${linkClasses.root}`]: linkStyles.root
    }
});

export * from './dialogs';
export * from './header';
