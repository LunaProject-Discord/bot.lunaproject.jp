'use client';

import { MessageEditorFabInsertMenu } from '@/app/dashboard/[id]/message-builder/_components/insert_menu';
import { MoreVertIcon } from '@/components/icons';
import {
    messageEditorClasses,
    MessageEditorConfigExtension,
    MessageEditorDocumentExtension,
    MessageEditorHeader,
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
    MessageEditorMessageEmbedTitleExtension,
    MessageEditorMessageExtension,
    MessageEditorMessageHeaderAvatarExtension,
    MessageEditorMessageHeaderExtension,
    MessageEditorMessageHeaderNameExtension,
    MessageEditorMessageHeaderTimestampExtension,
    MessageEditorMessagesExtension,
    MessageEditorRoot,
    MessageEditorUnicodeEmojiExtension
} from '@/components/message_v2';
import { GuildConfigurationViewProps, UserViewProps } from '@/interfaces/view';
import { getUserAvatar } from '@/utils/cdn';
import { getUserDisplayName } from '@/utils/discord';
import { Dialog, DialogContent } from '@lunaproject/web-core/dist/components/Dialog';
import { Schema } from '@lunaproject/web-editor';
import { Box, dialogClasses, Fab, styled, useMediaQuery } from '@mui/material';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Code } from '@tiptap/extension-code';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { Heading } from '@tiptap/extension-heading';
import { History } from '@tiptap/extension-history';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import React, { useEffect } from 'react';

const Fabs = styled(Box)(({ theme }) => ({
    height: 'auto !important',
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

type ViewProps = UserViewProps & GuildConfigurationViewProps;

export const View = ({ user, guild, configuration, localization }: ViewProps) => {
    const { translations } = localization;

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const editor = useEditor({
        content: Schema.node(
            'doc',
            {},
            Schema.node(
                'messages',
                {},
                Schema.node(
                    'message',
                    {},
                    [
                        Schema.node(
                            'messageHeader',
                            {},
                            [
                                Schema.node('messageHeaderAvatar', {
                                    src: getUserAvatar(user)
                                }),
                                Schema.node(
                                    'messageHeaderName',
                                    {},
                                    [Schema.text(getUserDisplayName(user))]
                                ),
                                Schema.node('messageHeaderTimestamp')
                            ]
                        ),
                        Schema.node(
                            'messageContent',
                            {},
                            Schema.node('paragraph')
                        )
                    ]
                )
            )
        ),
        extensions: [
            MessageEditorConfigExtension.configure({
                locale: 'ja'
            }),
            MessageEditorDocumentExtension,
            Text,

            // レイアウト
            MessageEditorMessagesExtension.extend({
                content: 'message'
            }),
            MessageEditorMessageExtension,
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
            MessageEditorMessageEmbedFooterExtension,
            MessageEditorMessageEmbedFooterIconExtension,
            MessageEditorMessageEmbedFooterTextExtension,
            MessageEditorMessageEmbedFooterTimestampExtension,
            MessageEditorMessageEmbedFooterSeparatorExtension,


            // ブロック
            Paragraph,
            Heading.configure({
                levels: [1, 2, 3]
            }),
            BulletList,
            OrderedList,
            ListItem,
            Blockquote,
            MessageEditorUnicodeEmojiExtension,

            // マーク
            Bold,
            Italic,
            Underline,
            Strike,
            Code,
            Link,

            // ユーティリティ
            History,
            Dropcursor,
            Gapcursor
        ],
        editorProps: {
            attributes: {
                class: messageEditorClasses.input
            }
        }
        // immediatelyRender: false
    });

    useEffect(() => {
        (window as any).editor = editor;
    }, [editor]);

    return (
        <Dialog
            open
            fullScreen={isMobile}
            fullWidth
            maxWidth="lg"
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
            <EditorContext.Provider value={{ editor }}>
                <MessageEditorHeader localization={localization} />
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
                        <Fabs>
                            <Fab color="default" size="medium">
                                <MoreVertIcon />
                            </Fab>
                            <MessageEditorFabInsertMenu localization={localization} />
                        </Fabs>
                    </MessageEditorRoot>
                </DialogContent>
            </EditorContext.Provider>
        </Dialog>
    );
};
