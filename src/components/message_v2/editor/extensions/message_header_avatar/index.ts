import { DefaultAvatar, MessageHeaderAvatarElement, messageHeaderClasses } from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';

export const MessageEditorMessageHeaderAvatarExtension = Node.create({
    name: 'messageHeaderAvatar',

    group: 'layout',

    selectable: false,

    draggable: false,

    addAttributes() {
        return {
            src: {
                default: DefaultAvatar.Blurple
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageHeaderAvatarElement}.${messageHeaderClasses.avatar}`
            }
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            MessageHeaderAvatarElement as string,
            {
                contenteditable: 'false',
                class: messageHeaderClasses.avatar,
                src: node.attrs.src
            }
        ];
    }
});
