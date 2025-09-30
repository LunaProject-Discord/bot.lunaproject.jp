import { messageContentClasses, MessageContentElement } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageContentExtension = Node.create({
    name: 'messageContent',

    group: 'layout',

    content: 'block+',

    parseHTML() {
        return [
            {
                tag: `${MessageContentElement}.${messageContentClasses.root}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageContentElement as string,
            {
                class: messageContentClasses.root
            },
            0
        ];
    }
});
