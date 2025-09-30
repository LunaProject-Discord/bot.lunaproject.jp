import { linkClasses, LinkElement } from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { isAllowedUri, Link, LinkOptions } from '@tiptap/extension-link';

export const MessageEditorLinkExtension = Link.extend<LinkOptions>({
    addOptions(): LinkOptions {
        return {
            ...this.parent?.(),
            openOnClick: false
        };
    },

    renderHTML({ HTMLAttributes }) {
        if (
            !this.options.isAllowedUri(
                HTMLAttributes.href,
                {
                    defaultValidate: (href) => Boolean(isAllowedUri(href, this.options.protocols)),
                    protocols: this.options.protocols,
                    defaultProtocol: this.options.defaultProtocol
                }
            )
        )
            return [
                LinkElement as string,
                mergeAttributes(
                    this.options.HTMLAttributes,
                    HTMLAttributes,
                    {
                        href: '',
                        class: linkClasses.root
                    }
                ),
                0
            ];

        return [
            LinkElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: linkClasses.root
                }
            ),
            0
        ];
    }
});
