import { messageEmbedAuthorClasses, MessageEmbedAuthorNameElement } from '@lunaproject/web-discord-components';
import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedAuthorName: {
            setMessageEmbedAuthorName: () => ReturnType;
            deleteMessageEmbedAuthorName: () => ReturnType;
            setMessageEmbedAuthorUrl: (url: string | undefined) => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedAuthorNameExtension = Node.create({
    name: 'messageEmbedAuthorName',

    group: 'layout',

    content: '(text|placeholder|lineBreak)*',

    marks: '',

    addCommands() {
        return {
            setMessageEmbedAuthorName: () => ({ commands }) => commands.setMessageEmbedAuthor(),
            deleteMessageEmbedAuthorName: () => ({ commands }) => commands.deleteMessageEmbedAuthor(),
            setMessageEmbedAuthorUrl: (url) => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = currentCursorNodePos.closest('messageEmbedAuthor');
                if (!messageEmbedAuthorNodePos)
                    return false;

                // MessageEmbedAuthor に MessageEmbedAuthorName が存在するか
                const messageEmbedAuthorNameNodePos = messageEmbedAuthorNodePos.querySelector('messageEmbedAuthorName');
                if (!messageEmbedAuthorNameNodePos)
                    return false;

                // MessageEmbedAuthorName の属性を更新
                return commands.updateAttributes(
                    'messageEmbedAuthorName',
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
                tag: `${MessageEmbedAuthorNameElement}.${messageEmbedAuthorClasses.name}`
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            MessageEmbedAuthorNameElement as string,
            mergeAttributes(
                HTMLAttributes,
                {
                    class: messageEmbedAuthorClasses.name
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

                // 現在のカーソル位置の要素が MessageEmbedAuthorName であるか
                if (currentCursorNode.type.name !== 'messageEmbedAuthorName')
                    return false;

                return editor.commands.setLineBreak();
            }
        };
    }
});
