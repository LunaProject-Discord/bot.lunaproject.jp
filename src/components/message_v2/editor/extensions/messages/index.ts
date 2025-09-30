import {
    AppearanceColor,
    AppearanceDisplay,
    messagesClasses,
    MessagesRootElement
} from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';
import clsx from 'clsx';

export const MessageEditorMessagesExtension = Node.create({
    name: 'messages',

    group: 'layout',

    content: 'message+',

    selectable: false,

    draggable: false,

    addAttributes() {
        return {
            color: {
                default: 'dark'
            },
            display: {
                default: 'cozy'
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessagesRootElement}.${messagesClasses.root}`
            }
        ];
    },

    renderHTML({ node }) {
        const color: AppearanceColor = node.attrs.color;
        const display: AppearanceDisplay = node.attrs.display;

        return [
            MessagesRootElement as string,
            {
                class: clsx(
                    messagesClasses.root,
                    color === 'light' ? messagesClasses.colorLight : messagesClasses.colorDark,
                    display === 'compact' ? messagesClasses.displayCompact : messagesClasses.displayCozy
                )
            },
            0
        ];
    }
});
