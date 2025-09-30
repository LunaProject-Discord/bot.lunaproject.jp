import { messageHeaderClasses, MessageHeaderNameElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageHeaderNameExtension = Node.create({
    name: 'messageHeaderName',

    group: 'layout',

    content: 'text*',

    marks: '',

    selectable: false,

    draggable: false,

    isolating: true,

    parseHTML() {
        return [
            {
                tag: `${MessageHeaderNameElement}.${messageHeaderClasses.name}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageHeaderNameElement as string,
            {
                // contenteditable: 'false',
                class: messageHeaderClasses.name
            },
            0
        ];
    }
});
