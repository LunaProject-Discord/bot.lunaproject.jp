import { messageEmbedAuthorClasses, MessageEmbedAuthorRootElement } from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedAuthor: {
            setMessageEmbedAuthor: () => ReturnType;
            deleteMessageEmbedAuthor: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedAuthorExtension = Node.create({
    name: 'messageEmbedAuthor',

    group: 'layout',

    content: 'messageEmbedAuthorIcon? messageEmbedAuthorName',

    selectable: false,

    draggable: false,

    addCommands() {
        return {
            setMessageEmbedAuthor: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedAuthor が存在するか
                const messageEmbedAuthorNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthor');
                if (messageEmbedAuthorNodePos)
                    return false;

                // MessageEmbed に MessageEmbedAuthor を追加
                return commands.insertContentAt(
                    messageEmbedNodePos.from,
                    Schema.node(
                        'messageEmbedAuthor',
                        {},
                        Schema.node('messageEmbedAuthorName')
                    )
                );
            },
            deleteMessageEmbedAuthor: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = currentCursorNodePos.closest('messageEmbedAuthor');
                if (!messageEmbedAuthorNodePos)
                    return false;

                // MessageEmbed から MessageEmbedAuthor を削除
                return commands.deleteRange({
                    from: messageEmbedAuthorNodePos.from - 1,
                    to: messageEmbedAuthorNodePos.to
                });
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedAuthorRootElement}.${messageEmbedAuthorClasses.root}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedAuthorRootElement as string,
            {
                class: messageEmbedAuthorClasses.root
            },
            0
        ];
    }
});
