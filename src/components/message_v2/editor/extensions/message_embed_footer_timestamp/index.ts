import {
    formatTimestamp,
    messageEmbedFooterClasses,
    MessageEmbedFooterTextElement
} from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { Node } from '@tiptap/core';
import { DateTime } from 'luxon';
import { MessageEditorConfigExtensionStorage } from 'src/components/message_v2/editor';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedFooterTimestamp: {
            setMessageEmbedTimestamp: (timestamp: DateTime<true> | 'now' | null) => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedFooterTimestampExtension = Node.create({
    name: 'messageEmbedFooterTimestamp',

    group: 'layout',

    selectable: false,

    draggable: false,

    addCommands() {
        return {
            setMessageEmbedTimestamp: (timestamp) => ({ editor, state, chain }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorPos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorPos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // 共通のコンテンツ
                const content = [
                    Schema.node(
                        'messageEmbedFooterTimestamp',
                        {
                            timestamp
                        }
                    )
                ];

                // MessageEmbed に MessageEmbedFooter が存在するか
                const messageEmbedFooterNodePos = messageEmbedNodePos.querySelector('messageEmbedFooter');
                if (!messageEmbedFooterNodePos) {
                    return chain()
                        .setNodeSelection(messageEmbedNodePos.from)
                        .insertContentAt(
                            messageEmbedNodePos.to - 2,
                            Schema.node(
                                'messageEmbedFooter',
                                {},
                                content
                            )
                        )
                        .run();
                }

                // MessageEmbedFooterText が存在する場合、MessageEmbedFooterSeparator を追加
                const messageEmbedFooterTextNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterText');
                if (messageEmbedFooterTextNodePos && messageEmbedFooterTextNodePos.node.textContent.length > 0)
                    content.unshift(Schema.node('messageEmbedFooterSeparator'));

                // MessageEmbedFooter 内の MessageEmbedFooterTimestamp を取得
                const messageEmbedFooterTimestampNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterTimestamp');
                if (messageEmbedFooterTimestampNodePos) {
                    if (!timestamp) {
                        // 削除処理
                        return chain()
                            .setNodeSelection(messageEmbedNodePos.from)
                            .deleteRange((!messageEmbedFooterTextNodePos || messageEmbedFooterTextNodePos.node.textContent.length < 1) ? {
                                from: messageEmbedFooterNodePos.from - 1,
                                to: messageEmbedFooterNodePos.to
                            } : {
                                from: messageEmbedFooterTimestampNodePos.from,
                                to: messageEmbedFooterTimestampNodePos.to
                            })
                            .run();
                    }

                    // 更新処理
                    // MessageEmbedFooter 内の MessageEmbedFooterSeparator を取得
                    const messageEmbedFooterSeparatorNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterSeparator');

                    // MessageEmbedFooter に MessageEmbedFooterTimestamp を追加
                    return chain()
                        .setNodeSelection(messageEmbedNodePos.from)
                        .insertContentAt(
                            {
                                from: messageEmbedFooterSeparatorNodePos?.from ?? messageEmbedFooterTimestampNodePos.from,
                                to: messageEmbedFooterTimestampNodePos.to
                            },
                            content
                        )
                        .run();
                }

                if (!timestamp)
                    return false;

                // MessageEmbedFooter に MessageEmbedFooterTimestamp を追加
                return chain()
                    .setNodeSelection(messageEmbedNodePos.from)
                    .insertContentAt(
                        messageEmbedFooterNodePos.to - 2,
                        content
                    )
                    .run();
            }
        };
    },

    addAttributes() {
        return {
            timestamp: {
                default: 'now',
                isRequired: true
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `time.${messageEmbedFooterClasses.text}`,
                getAttrs: (element) => {
                    const timestamp = element.getAttribute('data-timestamp');
                    if (!timestamp)
                        return false;

                    return {
                        timestamp: timestamp === 'now' ? 'now' : DateTime.fromSeconds(Number(timestamp), { zone: 'utc' })
                    };
                }
            }
        ];
    },

    renderHTML({ node }) {
        const timestamp: DateTime<true> | 'now' = node.attrs.timestamp;

        const { translations }: MessageEditorConfigExtensionStorage = this.editor?.storage.config;

        return [
            MessageEmbedFooterTextElement as string,
            {
                class: messageEmbedFooterClasses.text
            },
            formatTimestamp(
                timestamp,
                {
                    today: translations.timestamp_today ?? '\'Today at\' h:mm a',
                    yesterday: translations.timestamp_yesterday ?? '\'Yesterday at\' h:mm a',
                    tomorrow: translations.timestamp_tomorrow ?? '\'Tomorrow at\' h:mm a',
                    other: translations.timestamp_other ?? 'MM/dd/yyyy h:mm a'
                }
            )
        ];
    }
});
