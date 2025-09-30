import { underlineClasses, UnderlineElement } from '@lunaproject/web-discord-components';
import { markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core';
import { underscoreInputRegex, underscorePasteRegex } from '@tiptap/extension-bold';
import { Underline, UnderlineOptions } from '@tiptap/extension-underline';

export const MessageEditorUnderlineExtension = Underline.extend<UnderlineOptions>({
    parseHTML() {
        return [
            {
                tag: `${UnderlineElement}.${underlineClasses.root}`
            },
            {
                tag: 'u'
            },
            {
                style: 'text-decoration',
                consuming: false,
                getAttrs: (style) => ((style as string).includes('underline') ? {} : false)
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            UnderlineElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: underlineClasses.root
                }
            ),
            0
        ];
    },

    addInputRules() {
        return [
            markInputRule({
                find: underscoreInputRegex,
                type: this.type
            })
        ];
    },

    addPasteRules() {
        return [
            markPasteRule({
                find: underscorePasteRegex,
                type: this.type
            })
        ];
    }
});
