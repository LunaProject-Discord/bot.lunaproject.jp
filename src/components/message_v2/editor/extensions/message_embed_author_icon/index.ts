import {
    DefaultAvatar,
    messageEmbedAuthorClasses,
    MessageEmbedAuthorIconElement
} from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { mergeAttributes, Node } from '@tiptap/core';

export interface MessageEditorMessageEmbedAuthorIconExtensionOptions {
    defaultSrc: string;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedAuthorIcon: {
            setMessageEmbedAuthorIcon: (src: string) => ReturnType;
            deleteMessageEmbedAuthorIcon: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedAuthorIconExtension = Node.create<MessageEditorMessageEmbedAuthorIconExtensionOptions>({
    name: 'messageEmbedAuthorIcon',

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
            setMessageEmbedAuthorIcon: (src) => ({ editor, state, commands }) => {
                if (src.length < 1)
                    return false;

                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = currentCursorNodePos.closest('messageEmbedAuthor');
                if (!messageEmbedAuthorNodePos)
                    return false;

                // 共通のコンテンツ
                const content = Schema.node(
                    'messageEmbedAuthorIcon',
                    {
                        src
                    }
                );

                // MessageEmbedAuthor に MessageEmbedAuthorIcon が存在するか
                const messageEmbedAuthorIconNodePos = messageEmbedAuthorNodePos.querySelector('messageEmbedAuthorIcon');
                if (messageEmbedAuthorIconNodePos) {
                    return commands.insertContentAt(
                        {
                            from: messageEmbedAuthorIconNodePos.from,
                            to: messageEmbedAuthorIconNodePos.to
                        },
                        content
                    );
                }

                // MessageEmbedAuthor に MessageEmbedAuthorIcon を追加
                return commands.insertContentAt(
                    messageEmbedAuthorNodePos.from,
                    content
                );
            },
            deleteMessageEmbedAuthorIcon: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = currentCursorNodePos.closest('messageEmbedAuthor');
                if (!messageEmbedAuthorNodePos)
                    return false;

                // MessageEmbedAuthor に MessageEmbedAuthorIcon が存在するか
                const messageEmbedAuthorIconNodePos = messageEmbedAuthorNodePos.querySelector('messageEmbedAuthorIcon');
                if (!messageEmbedAuthorIconNodePos)
                    return false;

                // MessageEmbed から MessageEmbedAuthorIcon を削除
                return commands.deleteRange({
                    from: messageEmbedAuthorIconNodePos.from,
                    to: messageEmbedAuthorIconNodePos.to
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
                tag: `${MessageEmbedAuthorIconElement}.${messageEmbedAuthorClasses.icon}`,
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
            MessageEmbedAuthorIconElement as string,
            mergeAttributes(
                HTMLAttributes,
                {
                    contenteditable: 'false',
                    class: messageEmbedAuthorClasses.icon
                }
            )
        ];
    }
});
