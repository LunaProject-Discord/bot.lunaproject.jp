import { messageEmbedClasses, MessageEmbedTitleElement } from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedTitle: {
            setMessageEmbedTitle: () => ReturnType;
            deleteMessageEmbedTitle: () => ReturnType;
            setMessageEmbedTitleUrl: (url: string | undefined) => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedTitleExtension = Node.create({
    name: 'messageEmbedTitle',

    group: 'layout',

    content: 'inline*',

    marks: 'bold italic underline strike code',

    addCommands() {
        return {
            setMessageEmbedTitle: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedTitle が存在するか
                const messageEmbedTitleNodePos = messageEmbedNodePos.querySelector('messageEmbedTitle');
                if (messageEmbedTitleNodePos)
                    return false;

                // MessageEmbed 内の MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthor');

                // MessageEmbed に MessageEmbedTitle を追加
                return commands.insertContentAt(
                    Math.max(
                        messageEmbedNodePos.from,
                        (messageEmbedAuthorNodePos?.to ?? 0) - 1
                    ),
                    Schema.node('messageEmbedTitle')
                );
            },
            deleteMessageEmbedTitle: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);
                const currentCursorNode = currentCursorNodePos.node;

                // 現在のカーソル位置の要素が MessageEmbedTitle であるか
                if (currentCursorNode.type.name !== 'messageEmbedTitle')
                    return false;

                // MessageEmbed から MessageEmbedTitle を削除
                return commands.deleteRange({
                    from: currentCursorNodePos.from - 1,
                    to: currentCursorNodePos.to
                });
            },
            setMessageEmbedTitleUrl: (url) => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);
                const currentCursorNode = currentCursorNodePos.node;

                // 現在のカーソル位置の要素が MessageEmbedTitle であるか
                if (currentCursorNode.type.name !== 'messageEmbedTitle')
                    return false;

                // MessageEmbedTitle の属性を更新
                return commands.updateAttributes(
                    'messageEmbedTitle',
                    {
                        url: url && url.length > 0 ? url : null
                    }
                );
            }
        };
    },

    addAttributes() {
        return {
            url: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-url'),
                renderHTML: (attributes) => {
                    if (!attributes.url)
                        return {};

                    return {
                        'data-url': attributes.url
                    };
                }
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedTitleElement}.${messageEmbedClasses.title}`
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            MessageEmbedTitleElement as string,
            mergeAttributes(
                HTMLAttributes,
                {
                    class: messageEmbedClasses.title
                }
            ),
            0
        ];
    },

    addKeyboardShortcuts() {
        return {
            'Enter': ({ editor }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = editor.state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);
                const currentCursorNode = currentCursorNodePos.node;

                // 現在のカーソル位置の要素が MessageEmbedTitle であるか
                if (currentCursorNode.type.name !== 'messageEmbedTitle')
                    return false;

                return editor.commands.setLineBreak();
            }
        };
    }
});
