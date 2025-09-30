import {
    DefaultAvatar,
    messageEmbedFooterClasses,
    MessageEmbedFooterIconElement
} from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { mergeAttributes, Node } from '@tiptap/core';

export interface MessageEditorMessageEmbedFooterIconExtensionOptions {
    defaultSrc: string;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedFooterIcon: {
            setMessageEmbedFooterIcon: (src: string) => ReturnType;
            deleteMessageEmbedFooterIcon: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedFooterIconExtension = Node.create<MessageEditorMessageEmbedFooterIconExtensionOptions>({
    name: 'messageEmbedFooterIcon',

    group: 'layout',

    selectable: false,

    draggable: false,

    addOptions() {
        return {
            defaultSrc: DefaultAvatar.Blurple
        };
    },

    addCommands() {
        return {
            setMessageEmbedFooterIcon: (src) => ({ editor, state, commands }) => {
                if (src.length < 1)
                    return false;

                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedFooter を取得
                const messageEmbedFooterNodePos = currentCursorNodePos.closest('messageEmbedFooter');
                if (!messageEmbedFooterNodePos)
                    return false;

                // 共通のコンテンツ
                const content = Schema.node(
                    'messageEmbedFooterIcon',
                    {
                        src
                    }
                );

                // MessageEmbedFooter に MessageEmbedFooterIcon が存在するか
                const messageEmbedFooterIconNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterIcon');
                if (messageEmbedFooterIconNodePos) {
                    return commands.insertContentAt(
                        {
                            from: messageEmbedFooterIconNodePos.from,
                            to: messageEmbedFooterIconNodePos.to
                        },
                        content
                    );
                }

                // MessageEmbedFooter に MessageEmbedFooterIcon を追加
                return commands.insertContentAt(
                    messageEmbedFooterNodePos.from,
                    content
                );
            },
            deleteMessageEmbedFooterIcon: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedFooter を取得
                const messageEmbedFooterNodePos = currentCursorNodePos.closest('messageEmbedFooter');
                if (!messageEmbedFooterNodePos)
                    return false;

                // MessageEmbedFooter に MessageEmbedFooterIcon が存在するか
                const messageEmbedFooterIconNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterIcon');
                if (!messageEmbedFooterIconNodePos)
                    return false;

                // MessageEmbedFooter から MessageEmbedFooterIcon を削除
                return commands.deleteRange({
                    from: messageEmbedFooterIconNodePos.from,
                    to: messageEmbedFooterIconNodePos.to
                });
            }
        };
    },

    addAttributes() {
        return {
            src: {
                default: this.options.defaultSrc,
                parseHTML: (element) => (element as HTMLImageElement).src || this.options.defaultSrc,
                renderHTML: (attributes) => {
                    return {
                        src: attributes.src || this.options.defaultSrc
                    };
                },
                isRequired: true
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFooterIconElement}.${messageEmbedFooterClasses.icon}`,
                getAttrs: (element) => {
                    const src = (element as HTMLImageElement).src;
                    if (!src)
                        return false;

                    return {
                        src
                    };
                }
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            MessageEmbedFooterIconElement as string,
            mergeAttributes(
                HTMLAttributes,
                {
                    contenteditable: 'false',
                    class: messageEmbedFooterClasses.icon
                }
            )
        ];
    }
});
