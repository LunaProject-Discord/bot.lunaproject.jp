import { emojiClasses, UnicodeEmoji } from '@lunaproject/web-discord-components';
import { findEmoji, getEmojiWithName } from '@lunaproject/web-discord-components/dist/transformers/markdown/utils';
import { mergeAttributes, Node, nodeInputRule, nodePasteRule } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { createElement } from 'react';

export const MessageEditorUnicodeEmojiExtension = Node.create({
    name: 'unicodeEmoji',

    group: 'inline',

    inline: true,

    atom: true,

    selectable: false,

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
            },
            triggered: {
                default: true,
                rendered: false
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `img.${emojiClasses.root}.${emojiClasses.unicode}`,
                getAttrs: (element) => {
                    const value = element.getAttribute('data-value');
                    if (!value)
                        return false;

                    return {
                        value
                    };
                }
            },
            {
                tag: 'span',
                getAttrs: (element) => {
                    const imageElement = element.querySelector(`img.${emojiClasses.root}.${emojiClasses.unicode}`);
                    if (!imageElement)
                        return false;

                    const value = imageElement.getAttribute('data-value');
                    if (!value)
                        return false;

                    return {
                        value
                    };
                }
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'img',
            mergeAttributes(
                HTMLAttributes,
                {
                    class: `${emojiClasses.root} ${emojiClasses.unicode}`
                }
            )
        ];
    },

    renderText({ node }) {
        return node.attrs.value;
    },

    addNodeView() {
        return ReactNodeViewRenderer(
            ({ node }) => createElement(
                NodeViewWrapper,
                { as: 'span' },
                createElement(
                    UnicodeEmoji,
                    {
                        emoji: node.attrs.value
                    }
                )
            )
        );
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: (text) => {
                    const match = /(:([^\s:]+?(?:::skin-tone-\d)?):)/.exec(text);
                    if (!match)
                        return null;

                    const name = getEmojiWithName(match[2]);
                    if (!name)
                        return null;

                    const emoji = findEmoji(name);
                    if (!emoji)
                        return null;

                    return {
                        index: match.index,
                        text: match[1],
                        data: { emoji }
                    };
                },
                type: this.type,
                getAttributes: (match) => ({
                    value: match.data!.emoji,
                    triggered: false
                })
            })
        ];
    },

    addPasteRules() {
        return [
            nodePasteRule({
                find: (text) => {
                    const match = /(:([^\s:]+?(?:::skin-tone-\d)?):)/.exec(text);
                    if (!match)
                        return null;

                    const name = getEmojiWithName(match[2]);
                    if (!name)
                        return null;

                    const emoji = findEmoji(name);
                    if (!emoji)
                        return null;

                    return [
                        {
                            index: match.index,
                            text: match[1],
                            data: { emoji }
                        }
                    ];
                },
                type: this.type,
                getAttributes: (match) => ({
                    value: match.data!.emoji
                })
            })
        ];
    },

    onUpdate() {
        const currentCursorResolvedPos = this.editor.state.selection.$head;
        const currentCursorBeforeNode = currentCursorResolvedPos.nodeBefore;
        if (!currentCursorBeforeNode || currentCursorBeforeNode.type.name !== this.name || currentCursorBeforeNode.attrs.triggered)
            return;

        this.editor.commands.insertContentAt(
            {
                from: currentCursorResolvedPos.pos - 1,
                to: currentCursorResolvedPos.pos
            },
            {
                type: this.name,
                attrs: {
                    value: currentCursorBeforeNode.attrs.value,
                    triggered: true
                }
            }
        );
    }
});
