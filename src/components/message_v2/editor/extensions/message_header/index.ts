import { messageHeaderClasses, MessageHeaderRootElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageHeaderExtension = Node.create({
    name: 'messageHeader',

    group: 'layout',

    content: 'messageHeaderAvatar messageHeaderName messageHeaderTimestamp',

    selectable: false,

    draggable: false,

    parseHTML() {
        return [
            {
                tag: `${MessageHeaderRootElement}.${messageHeaderClasses.root}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageHeaderRootElement as string,
            {
                contenteditable: 'false',
                class: messageHeaderClasses.root
            },
            0
        ];
    }
});
