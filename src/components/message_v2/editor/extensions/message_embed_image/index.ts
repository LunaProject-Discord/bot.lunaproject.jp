import { DefaultAvatar, messageEmbedImageClasses, MessageEmbedImageElement } from '@lunaproject/web-discord-components';
import { mergeAttributes, Node } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface MessageEditorMessageEmbedImageExtensionOptions {
    defaultSrc: string;
}

export const MessageEditorMessageEmbedImageExtension = Node.create<MessageEditorMessageEmbedImageExtensionOptions>({
    name: 'messageEmbedImage',

    group: 'layout',

    selectable: false,

    draggable: false,

    addOptions() {
        return {
            defaultSrc: DefaultAvatar.Blurple
        };
    },

    addAttributes() {
        return {
            src: {
                default: this.options.defaultSrc,
                parseHTML: (element) => (element as HTMLImageElement).src || this.options.defaultSrc,
                renderHTML: (attributes) => {
                    return {
                        src: attributes.src || this.options.defaultSrc
                    };
                },
                isRequired: true
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedImageElement}.${messageEmbedImageClasses.root}`,
                getAttrs: (element) => {
                    const src = (element as HTMLImageElement).src;
                    if (!src)
                        return false;

                    return {
                        src
                    };
                }
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            MessageEmbedImageElement as string,
            mergeAttributes(
                HTMLAttributes,
                {
                    contenteditable: 'false',
                    class: messageEmbedImageClasses.root
                }
            )
        ];
    },

    addProseMirrorPlugins() {
        const { name } = this;

        return [
            new Plugin({
                key: new PluginKey(name),
                props: {
                    handleDOMEvents: {
                        dragstart: (_, e) => {
                            const target = e.target;
                            if (!target || !(target instanceof HTMLElement) || !target.classList.contains(messageEmbedImageClasses.root))
                                return;

                            e.preventDefault();
                        }
                    }
                }
            })
        ];
    }
});
