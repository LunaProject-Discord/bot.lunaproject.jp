import { messageEmbedFieldClasses, MessageEmbedFieldNameElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageEmbedFieldNameExtension = Node.create({
    name: 'messageEmbedFieldName',

    group: 'layout',

    content: 'inline*',

    marks: 'bold italic underline strike code',

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFieldNameElement}.${messageEmbedFieldClasses.name}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedFieldNameElement as string,
            {
                class: messageEmbedFieldClasses.name
            },
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

                // 現在のカーソル位置の要素が MessageEmbedFieldName であるか
                if (currentCursorNode.type.name !== 'messageEmbedFieldName')
                    return false;

                return editor.commands.setLineBreak();
            }
        };
    }
});
