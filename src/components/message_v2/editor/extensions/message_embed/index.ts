import {
    decimalToHex,
    messageEmbedClasses,
    MessageEmbedRootElement,
    rgbToDecimal
} from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { mergeAttributes, Node } from '@tiptap/core';
import { hexToRgba } from '@uiw/react-color';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbed: {
            selectMessageEmbed: (index: number) => ReturnType;
            addMessageEmbed: () => ReturnType;
            deleteMessageEmbed: () => ReturnType;
            setMessageEmbedColor: (color: string | number | null) => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedExtension = Node.create({
    name: 'messageEmbed',

    group: 'layout',

    // content: 'messageEmbedAuthor? messageEmbedTitle? messageEmbedDescription? messageEmbedFields? messageEmbedImage? messageEmbedFooter?',
    content: 'messageEmbedAuthor? messageEmbedTitle? messageEmbedDescription? messageEmbedFields? (messageEmbedImage|messageEmbedGallery)? messageEmbedThumbnail? messageEmbedFooter?',

    selectable: true,

    draggable: false,

    addCommands() {
        return {
            selectMessageEmbed: (index) => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い Message を取得
                const messageNodePos = currentCursorNodePos.closest('message');
                if (!messageNodePos)
                    return false;

                // Message 内の MessageEmbed をすべて取得
                const messageEmbedNodePoses = messageNodePos.querySelectorAll('messageEmbed');
                if (messageEmbedNodePoses.length < 1)
                    return false;

                // 指定された index の MessageEmbed を取得
                const messageEmbedNodePos = messageEmbedNodePoses.at(index);
                if (!messageEmbedNodePos)
                    return false;

                return commands.setNodeSelection(messageEmbedNodePos.pos);
            },
            addMessageEmbed: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い Message を取得
                const messageNodePos = currentCursorNodePos.closest('message');
                if (!messageNodePos)
                    return false;

                // Message 内の MessageEmbed をすべて取得
                const messageEmbedNodePoses = messageNodePos.querySelectorAll('messageEmbed');
                // MessageEmbed の個数が 10 未満か
                if (messageEmbedNodePoses.length >= 10)
                    return false;

                // 共通のコンテンツ
                const content = [
                    Schema.node(
                        'messageEmbed',
                        {},
                        [
                            Schema.node(
                                'messageEmbedTitle',
                                {},
                                Schema.text('Embed Title')
                            ),
                            Schema.node(
                                'messageEmbedDescription',
                                {},
                                Schema.node(
                                    'paragraph',
                                    {},
                                    Schema.text('Embed Description')
                                )
                            )
                        ]
                    )
                ];

                // Message に MessageAccessories が存在するか
                const messageAccessoriesNodePos = messageNodePos.querySelector('messageAccessories');
                if (messageAccessoriesNodePos) {
                    const messageAccessoriesNodeLastChildNodePos = messageAccessoriesNodePos.lastChild;
                    if (!messageAccessoriesNodeLastChildNodePos)
                        return false;

                    return commands.insertContentAt(
                        messageAccessoriesNodeLastChildNodePos.to - 1,
                        content
                    );
                }

                // MessageAccessories が存在しない場合、MessageAccessories と MessageEmbed を追加
                return commands.insertContentAt(
                    messageNodePos.to - 1,
                    Schema.node(
                        'messageAccessories',
                        {},
                        content
                    )
                );
            },
            deleteMessageEmbed: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed の親である MessageAccessories を取得
                const messageAccessoriesNodePos = messageEmbedNodePos.parent;
                if (!messageAccessoriesNodePos)
                    return false;

                // MessageEmbed をすべて取得して、削除対象以外をフィルタリングする
                const messageEmbedNodePoses = messageAccessoriesNodePos.querySelectorAll('messageEmbed')
                    .filter((embedNodePos) => embedNodePos.from !== messageEmbedNodePos.from || (embedNodePos.to - 1) !== messageEmbedNodePos.to);
                if (messageEmbedNodePoses.length < 1) {
                    // フィルタリングした結果、MessageEmbed の個数が 0 の場合は MessageAccessories ごと削除
                    return commands.deleteRange({
                        from: messageAccessoriesNodePos.from - 1,
                        to: messageAccessoriesNodePos.to
                    });
                }

                // Message から MessageEmbed を削除
                return commands.deleteRange({
                    from: messageEmbedNodePos.from - 1,
                    to: messageEmbedNodePos.to
                });
            },
            setMessageEmbedColor: (color) => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                if (typeof color === 'string')
                    color = rgbToDecimal(hexToRgba(color));

                // MessageEmbed の属性を更新
                return commands.updateAttributes(
                    'messageEmbed',
                    {
                        color
                    }
                );
            }
        };
    },

    addAttributes() {
        return {
            color: {
                default: null,
                parseHTML: (element) => {
                    const color = element.getAttribute('data-color');
                    if (color)
                        return Number(color);

                    const borderLeftColor = element.style.borderLeftColor;
                    if (!borderLeftColor)
                        return null;

                    const match = /rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/.exec(borderLeftColor);
                    if (!match)
                        return null;

                    const r = Number(match[1]);
                    const g = Number(match[2]);
                    const b = Number(match[3]);

                    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
                        return null;

                    return rgbToDecimal({ r, g, b });
                },
                renderHTML: (attributes) => {
                    const color = attributes.color ? Number(attributes.color) : null;
                    return {
                        'data-color': color,
                        style: color ? `border-left-color: ${decimalToHex(color)};` : undefined
                    };
                }
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedRootElement}.${messageEmbedClasses.root}`
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            MessageEmbedRootElement as string,
            mergeAttributes(
                HTMLAttributes,
                {
                    class: messageEmbedClasses.root
                }
            ),
            0
        ];
    }
});
