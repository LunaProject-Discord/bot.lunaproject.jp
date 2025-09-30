import { boldClasses, BoldElement } from '@lunaproject/web-discord-components';
import { markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core';
import { Bold, BoldOptions, starInputRegex, starPasteRegex } from '@tiptap/extension-bold';

export const MessageEditorBoldExtension = Bold.extend<BoldOptions>({
    priority: 101,

    parseHTML() {
        return [
            {
                tag: `${BoldElement}.${boldClasses.root}`
            },
            {
                tag: 'strong'
            },
            {
                tag: 'b',
                getAttrs: (element) => (element as HTMLElement).style.fontWeight !== 'normal' && null
            },
            {
                style: 'font-weight=400',
                clearMark: (mark) => mark.type.name === this.name
            },
            {
                style: 'font-weight',
                getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            BoldElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: boldClasses.root
                }
            ),
            0
        ];
    },

    addInputRules() {
        return [
            markInputRule({
                find: starInputRegex,
                type: this.type
            })
        ];
    },

    addPasteRules() {
        return [
            markPasteRule({
                find: starPasteRegex,
                type: this.type
            })
        ];
    }
});
