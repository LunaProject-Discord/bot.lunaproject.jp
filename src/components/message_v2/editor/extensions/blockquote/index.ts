import {
    blockquoteClasses,
    BlockquoteContentElement,
    BlockquoteDividerElement,
    BlockquoteRootElement
} from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { Blockquote, BlockquoteOptions } from '@tiptap/extension-blockquote';

export const MessageEditorBlockquoteExtension = Blockquote.extend<BlockquoteOptions>({
    renderHTML({ HTMLAttributes }) {
        return [
            BlockquoteRootElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: blockquoteClasses.root
                }
            ),
            [
                BlockquoteDividerElement as string,
                mergeAttributes(
                    this.options.HTMLAttributes,
                    HTMLAttributes,
                    {
                        class: blockquoteClasses.divider
                    }
                )
            ],
            [
                BlockquoteContentElement as string,
                mergeAttributes(
                    this.options.HTMLAttributes,
                    HTMLAttributes,
                    {
                        class: blockquoteClasses.content
                    }
                ),
                0
            ]
        ];
    }
});
