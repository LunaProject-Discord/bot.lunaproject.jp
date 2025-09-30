'use client';

import { editorProseMirrorClasses } from '@/components/editor';
import {
    deserialize,
    MessageBuilderMenu,
    MessageEditorBlockquoteExtension,
    MessageEditorBoldExtension,
    MessageEditorBulletListExtension,
    messageEditorClasses,
    MessageEditorConfigExtension,
    MessageEditorDocumentExtension,
    MessageEditorGalleryDialog,
    MessageEditorHeadingExtension,
    MessageEditorItalicExtension,
    MessageEditorLineBreakExtension,
    MessageEditorLinkExtension,
    MessageEditorListItemExtension,
    MessageEditorMessageAccessoriesExtension,
    MessageEditorMessageContentExtension,
    MessageEditorMessageEmbedAuthorExtension,
    MessageEditorMessageEmbedAuthorIconExtension,
    MessageEditorMessageEmbedAuthorNameExtension,
    MessageEditorMessageEmbedDescriptionExtension,
    MessageEditorMessageEmbedExtension,
    MessageEditorMessageEmbedFieldExtension,
    MessageEditorMessageEmbedFieldNameExtension,
    MessageEditorMessageEmbedFieldsExtension,
    MessageEditorMessageEmbedFieldValueExtension,
    MessageEditorMessageEmbedFooterExtension,
    MessageEditorMessageEmbedFooterIconExtension,
    MessageEditorMessageEmbedFooterSeparatorExtension,
    MessageEditorMessageEmbedFooterTextExtension,
    MessageEditorMessageEmbedFooterTimestampExtension,
    MessageEditorMessageEmbedGalleryExtension,
    MessageEditorMessageEmbedGalleryItemExtension,
    MessageEditorMessageEmbedImageExtension,
    MessageEditorMessageEmbedThumbnailExtension,
    MessageEditorMessageEmbedTitleExtension,
    MessageEditorMessageExtension,
    MessageEditorMessageHeaderAvatarExtension,
    MessageEditorMessageHeaderExtension,
    MessageEditorMessageHeaderNameExtension,
    MessageEditorMessageHeaderTimestampExtension,
    MessageEditorMessagesExtension,
    MessageEditorOrderedListExtension,
    MessageEditorPlaceholderExtension,
    MessageEditorRibbonTabs,
    MessageEditorRoot,
    MessageEditorStrikeExtension,
    MessageEditorUnderlineExtension,
    MessageEditorUnicodeEmojiExtension,
    MessageEditorUrlDialog,
    renderMarkdown,
    serialize
} from '@/components/message_v2';
import { LocalizationProps } from '@/interfaces/localization';
import { MessageData } from '@/interfaces/message';
import { Dialog, DialogContent } from '@lunaproject/web-core/dist/components/Dialog';
import { MuiDefaultTheme } from '@lunaproject/web-core/dist/utils';
import { User } from '@lunaproject/web-discord-components';
import { RibbonProvider, SelectionExtension } from '@lunaproject/web-editor';
import { CircularProgress, dialogClasses, useMediaQuery } from '@mui/material';
import { Code } from '@tiptap/extension-code';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { History } from '@tiptap/extension-history';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import { createCallable } from 'react-call';

export interface MessageBuilderProps {
    message: MessageData;
    author: Omit<User, 'id'>;
    placeholders?: string[];
}

export const MessageBuilder = createCallable<
    MessageBuilderProps,
    MessageData,
    LocalizationProps
>(
    (
        {
            call: {
                end,
                ended,
                root: {
                    localization
                }
            },
            message,
            author,
            placeholders
        }
    ) => {
        const { locale, translations } = localization;

        const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

        const [openBottomSheet, setOpenBottomSheet] = useState(true);

        const editor = useEditor({
            content: deserialize(message, author),
            extensions: [
                MessageEditorConfigExtension.configure({ locale }),
                MessageEditorDocumentExtension,
                Text,

                // レイアウト
                MessageEditorMessagesExtension.extend({
                    content: 'message'
                }),
                MessageEditorMessageExtension.extend({
                    selectable: false,
                    draggable: false
                }),
                MessageEditorMessageHeaderExtension,
                MessageEditorMessageHeaderAvatarExtension,
                MessageEditorMessageHeaderNameExtension,
                MessageEditorMessageHeaderTimestampExtension,
                MessageEditorMessageContentExtension,
                MessageEditorMessageAccessoriesExtension,
                MessageEditorMessageEmbedExtension,
                MessageEditorMessageEmbedAuthorExtension,
                MessageEditorMessageEmbedAuthorIconExtension,
                MessageEditorMessageEmbedAuthorNameExtension,
                MessageEditorMessageEmbedTitleExtension,
                MessageEditorMessageEmbedDescriptionExtension,
                MessageEditorMessageEmbedFieldsExtension,
                MessageEditorMessageEmbedFieldExtension,
                MessageEditorMessageEmbedFieldNameExtension,
                MessageEditorMessageEmbedFieldValueExtension,
                MessageEditorMessageEmbedImageExtension,
                MessageEditorMessageEmbedGalleryExtension,
                MessageEditorMessageEmbedGalleryItemExtension,
                MessageEditorMessageEmbedThumbnailExtension,
                MessageEditorMessageEmbedFooterExtension,
                MessageEditorMessageEmbedFooterIconExtension,
                MessageEditorMessageEmbedFooterTextExtension,
                MessageEditorMessageEmbedFooterTimestampExtension,
                MessageEditorMessageEmbedFooterSeparatorExtension,


                // ブロック
                Paragraph,
                MessageEditorHeadingExtension,
                MessageEditorBulletListExtension,
                MessageEditorOrderedListExtension,
                MessageEditorListItemExtension,
                MessageEditorBlockquoteExtension,
                MessageEditorUnicodeEmojiExtension,
                MessageEditorPlaceholderExtension.configure({
                    placeholders
                }),
                MessageEditorLineBreakExtension,

                // マーク
                MessageEditorBoldExtension,
                MessageEditorItalicExtension,
                MessageEditorUnderlineExtension,
                MessageEditorStrikeExtension,
                Code,
                MessageEditorLinkExtension,

                // ユーティリティ
                History,
                SelectionExtension.configure({
                    className: editorProseMirrorClasses.selection
                }),
                Dropcursor,
                Gapcursor
            ],
            editorProps: {
                attributes: {
                    class: messageEditorClasses.input
                }
            },
            parseOptions: {
                preserveWhitespace: 'full'
            }
        });

        useEffect(() => {
            (window as any).editor = editor;
            console.log(deserialize(message, author));
        }, [editor]);

        const handleSaveButtonClick = () => {
            if (!editor || !editor.isInitialized || editor.isDestroyed)
                return;

            const messageNodePos = editor.$doc.querySelector('message');
            if (!messageNodePos)
                return;

            const message = serialize(messageNodePos);
            if (!message)
                return;

            console.log(
                {
                    message,
                    content: message.content,
                    deserialized: renderMarkdown(message.content, 'full')
                }
            );

            setOpenBottomSheet(false);
            setTimeout(() => end(message), 200);
        };

        const handleCancelButtonClick = () => {
            setOpenBottomSheet(false);
            setTimeout(() => end(message), 200);
        };

        return (
            <Dialog
                open={!ended}
                fullScreen={isMobile}
                fullWidth
                maxWidth="md"
                sx={{
                    [`& .${dialogClasses.paper}`]: {
                        height: '100%',
                        gap: 0,
                        overflow: 'hidden',
                        bgcolor: 'background.default',
                        backgroundImage: 'none'
                    }
                }}
            >
                {editor ? <EditorContext.Provider value={{ editor }}>
                    <RibbonProvider editor={editor} tabs={MessageEditorRibbonTabs(localization)}>
                        <MessageBuilderMenu
                            openBottomSheet={openBottomSheet}
                            onSaveButtonClick={handleSaveButtonClick}
                            onCancelButtonClick={handleCancelButtonClick}
                            localization={localization}
                        />
                    </RibbonProvider>
                    <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                        <MessageEditorRoot
                            sx={{
                                position: 'relative',
                                '&, & > div, & > div > div, & > div > div > ul': {
                                    height: '100%'
                                }
                            }}
                        >
                            <EditorContext.Consumer>
                                {({ editor: currentEditor }) => (
                                    <EditorContent editor={currentEditor} />
                                )}
                            </EditorContext.Consumer>
                        </MessageEditorRoot>
                    </DialogContent>
                </EditorContext.Provider> : <CircularProgress />}

                <MessageEditorUrlDialog.Root localization={localization} />
                <MessageEditorGalleryDialog.Root localization={localization} />
            </Dialog>
        );
    },
    MuiDefaultTheme.transitions.duration.leavingScreen
);

export * from './components';
export * from './deserialize';
export * from './ribbon';
export * from './serialize';
