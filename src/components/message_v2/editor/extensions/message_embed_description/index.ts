import { messageEmbedClasses, MessageEmbedDescriptionElement } from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedDescription: {
            setMessageEmbedDescription: () => ReturnType;
            deleteMessageEmbedDescription: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedDescriptionExtension = Node.create({
    name: 'messageEmbedDescription',

    group: 'layout',

    content: 'block+',

    addCommands() {
        return {
            setMessageEmbedDescription: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedDescription が存在するか
                const messageEmbedDescriptionNodePos = messageEmbedNodePos.querySelector('messageEmbedDescription');
                if (messageEmbedDescriptionNodePos)
                    return false;

                // MessageEmbed に MessageEmbedAuthor が存在するか
                const messageEmbedAuthorNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthor');

                // MessageEmbed に MessageEmbedTitle が存在するか
                const messageEmbedTitleNodePos = messageEmbedNodePos.querySelector('messageEmbedTitle');

                // MessageEmbed に MessageEmbedDescription を追加
                return commands.insertContentAt(
                    Math.max(
                        messageEmbedNodePos.from,
                        (messageEmbedAuthorNodePos?.to ?? 0) - 1,
                        (messageEmbedTitleNodePos?.to ?? 0) - 1
                    ),
                    Schema.node(
                        'messageEmbedDescription',
                        {},
                        Schema.node('paragraph')
                    )
                );
            },
            deleteMessageEmbedDescription: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedDescription を取得
                const messageEmbedDescriptionNodePos = currentCursorNodePos.closest('messageEmbedDescription');
                if (!messageEmbedDescriptionNodePos)
                    return false;

                // MessageEmbed から MessageEmbedDescription を削除
                return commands.deleteRange({
                    from: messageEmbedDescriptionNodePos.from - 1,
                    to: messageEmbedDescriptionNodePos.to
                });
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedDescriptionElement}.${messageEmbedClasses.description}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedDescriptionElement as string,
            {
                class: messageEmbedClasses.description
            },
            0
        ];
    }
});
