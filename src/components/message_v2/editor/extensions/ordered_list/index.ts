import { orderedListClasses, OrderedListElement } from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { OrderedList, OrderedListOptions } from '@tiptap/extension-ordered-list';

export const MessageEditorOrderedListExtension = OrderedList.extend<OrderedListOptions>({
    renderHTML({ HTMLAttributes }) {
        return [
            OrderedListElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: orderedListClasses.root
                }
            ),
            0
        ];
    }
});
