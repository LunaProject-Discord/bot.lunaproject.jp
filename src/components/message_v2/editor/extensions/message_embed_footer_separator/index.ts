import { messageEmbedFooterClasses, MessageEmbedFooterSeparatorElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageEmbedFooterSeparatorExtension = Node.create({
    name: 'messageEmbedFooterSeparator',

    group: 'layout',

    selectable: false,

    draggable: false,

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFooterSeparatorElement}.${messageEmbedFooterClasses.separator}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedFooterSeparatorElement as string,
            {
                class: messageEmbedFooterClasses.separator
            },
            '•'
        ];
    }
});
