import {
    EditorBoldRibbonButton,
    EditorCodeRibbonButton,
    EditorInsertBulletListRibbonButton,
    EditorInsertOrderedListRibbonButton,
    EditorInsertParagraphRibbonButton,
    EditorItalicRibbonButton,
    EditorStrikeRibbonButton,
    EditorToggleBulletListRibbonButton,
    EditorToggleOrderedListRibbonButton,
    EditorUnderlineRibbonButton
} from '@/components/editor';
import {
    MessageEditorDeleteMessageEmbedAuthorRibbonButton,
    MessageEditorDeleteMessageEmbedDescriptionRibbonButton,
    MessageEditorDeleteMessageEmbedFieldRibbonButton,
    MessageEditorDeleteMessageEmbedFooterRibbonButton,
    MessageEditorDeleteMessageEmbedRibbonButton,
    MessageEditorDeleteMessageEmbedTitleRibbonButton,
    MessageEditorInsertHeadingLargeRibbonButton,
    MessageEditorInsertHeadingMediumRibbonButton,
    MessageEditorInsertHeadingSmallRibbonButton,
    MessageEditorInsertMessageEmbedAuthorRibbonButton,
    MessageEditorInsertMessageEmbedDescriptionRibbonButton,
    MessageEditorInsertMessageEmbedFieldRibbonButton,
    MessageEditorInsertMessageEmbedFooterRibbonButton,
    MessageEditorInsertMessageEmbedRibbonButton,
    MessageEditorInsertMessageEmbedTitleRibbonButton,
    MessageEditorSetMessageEmbedAuthorIconRibbonButton,
    MessageEditorSetMessageEmbedAuthorUrlRibbonButton,
    MessageEditorSetMessageEmbedFooterIconRibbonButton,
    MessageEditorSetMessageEmbedImagesRibbonButton,
    MessageEditorSetMessageEmbedThumbnailRibbonButton,
    MessageEditorSetMessageEmbedTitleUrlRibbonButton,
    MessageEditorToggleHeadingLargeRibbonButton,
    MessageEditorToggleHeadingMediumRibbonButton,
    MessageEditorToggleHeadingSmallRibbonButton,
    MessageEditorToggleMessageEmbedFieldInlineRibbonButton
} from '@/components/message_v2';
import { Localization } from '@/interfaces/localization';
import { EditorRibbonTab } from '@lunaproject/web-editor';
import { createElement, ReactNode } from 'react';

const buildContextualTabLabel = (data: { header: ReactNode, label: ReactNode }) => createElement(
    'div',
    {
        className: 'w-[calc(100%_+_calc(16px_*_2))] min-[600px]:w-full h-full flex flex-col items-center justify-center gap-1.5',
        style: {
            background: 'linear-gradient(180deg, var(--mui-palette-action-selected), transparent 50%)'
        }
    },
    createElement(
        'span',
        {
            className: '!leading-none',
            style: {
                font: 'var(--mui-font-caption)',
                color: 'var(--mui-palette-text-secondary)'
            }
        },
        data.header
    ),
    createElement(
        'span',
        {
            style: {
                lineHeight: 1
            }
        },
        data.label
    )
);

export const MessageEditorRibbonTabs = (localization: Localization): EditorRibbonTab[] => {
    const { translations } = localization;

    return [
        {
            name: 'home',
            label: translations.home,
            accessKey: 'H',
            content: [
                {
                    name: 'heading',
                    label: translations.heading,
                    content: [
                        MessageEditorToggleHeadingLargeRibbonButton(localization),
                        MessageEditorToggleHeadingMediumRibbonButton(localization),
                        MessageEditorToggleHeadingSmallRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'format',
                    label: translations.format,
                    content: [
                        EditorBoldRibbonButton(localization),
                        EditorItalicRibbonButton(localization),
                        EditorUnderlineRibbonButton(localization),
                        EditorStrikeRibbonButton(localization),
                        EditorCodeRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'list',
                    label: translations.list,
                    content: [
                        EditorToggleBulletListRibbonButton(localization),
                        EditorToggleOrderedListRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'insert',
            label: translations.insert,
            accessKey: 'I',
            content: [
                {
                    name: 'message',
                    label: 'Message',
                    content: [
                        MessageEditorInsertMessageEmbedRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'paragraph',
                    content: [
                        EditorInsertParagraphRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'heading',
                    label: translations.heading,
                    content: [
                        MessageEditorInsertHeadingLargeRibbonButton(localization),
                        MessageEditorInsertHeadingMediumRibbonButton(localization),
                        MessageEditorInsertHeadingSmallRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'list',
                    label: translations.list,
                    content: [
                        EditorInsertBulletListRibbonButton(localization),
                        EditorInsertOrderedListRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'view',
            label: translations.web_page_editor_ribbon_view,
            accessKey: 'V',
            content: []
        },
        {
            name: 'help',
            label: translations.help,
            accessKey: 'Y',
            content: []
        },
        {
            name: 'messageContent',
            label: buildContextualTabLabel({
                header: 'メッセージ',
                label: 'コンテンツ'
            }),
            accessKey: 'C',
            visible: ({ editor }) => editor.isActive('messageContent'),
            content: []
        },
        {
            name: 'messageEmbed',
            label: buildContextualTabLabel({
                header: 'Embed',
                label: translations.home
            }),
            accessKey: 'EH',
            visible: ({ editor }) => editor.isActive('messageEmbed'),
            content: [
                {
                    name: 'insert',
                    label: translations.insert,
                    content: [
                        MessageEditorInsertMessageEmbedTitleRibbonButton(localization),
                        MessageEditorInsertMessageEmbedDescriptionRibbonButton(localization),
                        MessageEditorInsertMessageEmbedFieldRibbonButton(localization),
                        MessageEditorInsertMessageEmbedAuthorRibbonButton(localization),
                        MessageEditorInsertMessageEmbedFooterRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'image_and_thumbnail',
                    content: [
                        MessageEditorSetMessageEmbedImagesRibbonButton(localization),
                        MessageEditorSetMessageEmbedThumbnailRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'delete',
                    content: [
                        MessageEditorDeleteMessageEmbedRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'messageEmbedTitle',
            label: buildContextualTabLabel({
                header: 'Embed',
                label: translations.embed_body_title
            }),
            accessKey: 'ET',
            visible: ({ editor }) => editor.isActive('messageEmbedTitle'),
            content: [
                {
                    name: 'attributes',
                    content: [
                        MessageEditorSetMessageEmbedTitleUrlRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'delete',
                    content: [
                        MessageEditorDeleteMessageEmbedTitleRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'messageEmbedDescription',
            label: buildContextualTabLabel({
                header: 'Embed',
                label: translations.embed_body_description
            }),
            accessKey: 'ED',
            visible: ({ editor }) => editor.isActive('messageEmbedDescription'),
            content: [
                {
                    name: 'delete',
                    content: [
                        MessageEditorDeleteMessageEmbedDescriptionRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'messageEmbedAuthor',
            label: buildContextualTabLabel({
                header: 'Embed',
                label: translations.embed_author
            }),
            accessKey: 'EA',
            visible: ({ editor }) => editor.isActive('messageEmbedAuthor'),
            content: [
                {
                    name: 'attributes',
                    content: [
                        MessageEditorSetMessageEmbedAuthorUrlRibbonButton(localization),
                        MessageEditorSetMessageEmbedAuthorIconRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'delete',
                    content: [
                        MessageEditorDeleteMessageEmbedAuthorRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'messageEmbedFooter',
            label: buildContextualTabLabel({
                header: 'Embed',
                label: translations.embed_footer
            }),
            accessKey: 'EO',
            visible: ({ editor }) => editor.isActive('messageEmbedFooter'),
            content: [
                {
                    name: 'attributes',
                    content: [
                        MessageEditorSetMessageEmbedFooterIconRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'delete',
                    content: [
                        MessageEditorDeleteMessageEmbedFooterRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'messageEmbedField',
            label: buildContextualTabLabel({
                header: 'Embed',
                label: translations.embed_field
            }),
            accessKey: 'EF',
            visible: ({ editor }) => editor.isActive('messageEmbedField'),
            content: [
                {
                    name: 'attributes',
                    content: [
                        MessageEditorToggleMessageEmbedFieldInlineRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'delete',
                    content: [
                        MessageEditorDeleteMessageEmbedFieldRibbonButton(localization)
                    ]
                }
            ]
        }
    ];
};
