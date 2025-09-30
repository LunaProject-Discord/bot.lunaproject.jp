import { italicClasses, ItalicElement } from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { Italic, ItalicOptions } from '@tiptap/extension-italic';

export const MessageEditorItalicExtension = Italic.extend<ItalicOptions>({
    parseHTML() {
        return [
            {
                tag: `${ItalicElement}.${italicClasses.root}`
            },
            {
                tag: 'em'
            },
            {
                tag: 'i',
                getAttrs: (element) => (element as HTMLElement).style.fontStyle !== 'normal' && null
            },
            {
                style: 'font-style=normal',
                clearMark: (mark) => mark.type.name === this.name
            },
            {
                style: 'font-style=italic'
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            ItalicElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: italicClasses.root
                }
            ),
            0
        ];
    }
});
