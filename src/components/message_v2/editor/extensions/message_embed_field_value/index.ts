import { messageEmbedFieldClasses, MessageEmbedFieldValueElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageEmbedFieldValueExtension = Node.create({
    name: 'messageEmbedFieldValue',

    group: 'layout',

    content: '(paragraph|list)+',

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFieldValueElement}.${messageEmbedFieldClasses.value}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedFieldValueElement as string,
            {
                class: messageEmbedFieldClasses.value
            },
            0
        ];
    }
});
