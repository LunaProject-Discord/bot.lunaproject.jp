import { strikethroughClasses, StrikethroughElement } from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { Strike, StrikeOptions } from '@tiptap/extension-strike';

export const MessageEditorStrikeExtension = Strike.extend<StrikeOptions>({
    parseHTML() {
        return [
            {
                tag: `${StrikethroughElement}.${strikethroughClasses.root}`
            },
            {
                tag: 's'
            },
            {
                tag: 'del'
            },
            {
                tag: 'strike'
            },
            {
                style: 'text-decoration',
                consuming: false,
                getAttrs: (style) => ((style as string).includes('line-through') ? {} : false)
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            StrikethroughElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: strikethroughClasses.root
                }
            ),
            0
        ];
    }
});
