import {
    DefaultAvatar,
    MessageEmbedGalleryCellElement,
    messageEmbedGalleryClasses,
    MessageEmbedGalleryImageElement
} from '@lunaproject/web-discord-components';
import { mergeAttributes, Node } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface MessageEditorMessageEmbedGalleryItemExtensionOptions {
    defaultSrc: string;
}

export const MessageEditorMessageEmbedGalleryItemExtension = Node.create<MessageEditorMessageEmbedGalleryItemExtensionOptions>({
    name: 'messageEmbedGalleryItem',

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
                parseHTML: (element) => {
                    const imageElement = element.querySelector<HTMLImageElement>(`${MessageEmbedGalleryImageElement}.${messageEmbedGalleryClasses.image}`);
                    if (!imageElement)
                        return false;

                    return imageElement.src || this.options.defaultSrc;
                },
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
                tag: `${MessageEmbedGalleryCellElement}.${messageEmbedGalleryClasses.cell}`,
                getAttrs: (element) => {
                    const imageElement = element.querySelector<HTMLImageElement>(`${MessageEmbedGalleryImageElement}.${messageEmbedGalleryClasses.image}`);
                    if (!imageElement)
                        return false;

                    const src = imageElement.src;
                    if (!src)
                        return false;

                    return {
                        src
                    };
                }
            },
            {
                tag: `${MessageEmbedGalleryImageElement}.${messageEmbedGalleryClasses.image}`,
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
            MessageEmbedGalleryCellElement as string,
            {
                contenteditable: 'false',
                class: messageEmbedGalleryClasses.cell
            },
            [
                MessageEmbedGalleryImageElement as string,
                mergeAttributes(
                    HTMLAttributes,
                    {
                        class: messageEmbedGalleryClasses.image
                    }
                )
            ]
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
                            if (!target || !(target instanceof HTMLElement))
                                return;

                            const classNames = Object.values(messageEmbedGalleryClasses);
                            if (!classNames.some((className) => target.classList.contains(className)))
                                return;

                            e.preventDefault();
                        }
                    }
                }
            })
        ];
    }
});
