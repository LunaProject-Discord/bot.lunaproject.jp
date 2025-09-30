import { messageClasses, MessageRootElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageExtension = Node.create({
    name: 'message',

    group: 'layout',

    content: 'messageHeader messageContent? messageAccessories?',

    selectable: true,

    draggable: true,

    parseHTML() {
        return [
            {
                tag: `${MessageRootElement}.${messageClasses.root}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageRootElement as string,
            {
                class: messageClasses.root
            },
            0
        ];
    }
});
