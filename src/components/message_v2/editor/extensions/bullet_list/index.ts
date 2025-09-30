import { bulletListClasses, BulletListElement } from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { BulletList, BulletListOptions } from '@tiptap/extension-bullet-list';

export const MessageEditorBulletListExtension = BulletList.extend<BulletListOptions>({
    renderHTML({ HTMLAttributes }) {
        return [
            BulletListElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: bulletListClasses.root
                }
            ),
            0
        ];
    }
});
