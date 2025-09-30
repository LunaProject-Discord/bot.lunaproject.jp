import { placeholderClasses, PlaceholderElement } from '@lunaproject/web-discord-components';
import { mergeAttributes, Node, nodeInputRule, nodePasteRule } from '@tiptap/core';

export const messageEditorPlaceholderInputRegex = /(?<!\\){[A-Za-z0-9_]+(?::[A-Za-z0-9_]+)?}$/;

export const messageEditorPlaceholderPasteRegex = /(?<!\\){[A-Za-z0-9_]+(?::[A-Za-z0-9_]+)?}/g;

export interface MessageEditorPlaceholderExtensionOptions {
    HTMLAttributes: Record<string, any>;
    placeholders: string[];
}

export const MessageEditorPlaceholderExtension = Node.create<MessageEditorPlaceholderExtensionOptions>({
    name: 'placeholder',

    group: 'inline',

    inline: true,

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
            placeholders: []
        };
    },

    addAttributes() {
        return {
            value: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-value'),
                renderHTML: (attributes) => {
                    return {
                        'data-value': attributes.value
                    };
                }
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${PlaceholderElement}.${placeholderClasses.root}`,
                getAttrs: (element) => {
                    const value = element.getAttribute('data-value');
                    if (!value || !this.options.placeholders.includes(value))
                        return false;

                    return {
                        value
                    };
                }
            }
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            PlaceholderElement as string,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: placeholderClasses.root
                }
            ),
            node.attrs.value
        ];
    },

    renderText({ node }) {
        return node.attrs.value;
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: (text) => {
                    const match = messageEditorPlaceholderInputRegex.exec(text);
                    if (!match)
                        return null;

                    const value = match['0'];
                    if (!value || !this.options.placeholders.includes(value))
                        return null;

                    return {
                        index: match.index,
                        text: value,
                        data: {
                            value
                        }
                    };
                },
                type: this.type,
                getAttributes: (match) => ({
                    value: match.data!.value
                })
            })
        ];
    },

    addPasteRules() {
        return [
            nodePasteRule({
                find: (text) => {
                    const match = messageEditorPlaceholderPasteRegex.exec(text);
                    if (!match)
                        return null;

                    const value = match['0'];
                    if (!value || !this.options.placeholders.includes(value))
                        return null;

                    return [
                        {
                            index: match.index,
                            text: value,
                            data: {
                                value
                            }
                        }
                    ];
                },
                type: this.type,
                getAttributes: (match) => ({
                    value: match.data!.value
                })
            })
        ];
    }
});
