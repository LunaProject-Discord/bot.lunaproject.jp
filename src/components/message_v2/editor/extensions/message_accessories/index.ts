import { messageAccessoriesClasses, MessageAccessoriesRootElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageAccessoriesExtension = Node.create({
    name: 'messageAccessories',

    group: 'layout',

    content: 'messageEmbed+',

    selectable: false,

    draggable: false,

    parseHTML() {
        return [
            {
                tag: `${MessageAccessoriesRootElement}.${messageAccessoriesClasses.root}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageAccessoriesRootElement as string,
            {
                class: messageAccessoriesClasses.root
            },
            0
        ];
    }
});
