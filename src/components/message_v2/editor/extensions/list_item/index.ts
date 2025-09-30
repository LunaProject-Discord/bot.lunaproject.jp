import { listItemClasses, ListItemElement } from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { ListItem, ListItemOptions } from '@tiptap/extension-list-item';

export const MessageEditorListItemExtension = ListItem.extend<ListItemOptions>({
    content: 'paragraph (paragraph|list)*',

    renderHTML({ HTMLAttributes }) {
        return [
            ListItemElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: listItemClasses.root
                }
            ),
            0
        ];
    }
});
