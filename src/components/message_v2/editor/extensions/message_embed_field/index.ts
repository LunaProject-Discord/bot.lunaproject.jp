import {
    getFieldGridColumn,
    messageEmbedFieldClasses,
    MessageEmbedFieldRootElement
} from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedField: {
            addMessageEmbedField: () => ReturnType;
            deleteMessageEmbedField: () => ReturnType;
            setMessageEmbedFieldInline: (inline: boolean) => ReturnType;
            toggleMessageEmbedFieldInline: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedFieldExtension = Node.create({
    name: 'messageEmbedField',

    group: 'layout',

    content: 'messageEmbedFieldName messageEmbedFieldValue',

    selectable: false,

    draggable: false,

    addCommands() {
        return {
            addMessageEmbedField: () => ({ editor, state, chain }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbedFields 内の MessageEmbedField をすべて取得
                const messageEmbedFieldNodePoses = messageEmbedNodePos.querySelectorAll('messageEmbedField');
                // MessageEmbedField の個数が 25 未満か
                if (messageEmbedFieldNodePoses.length >= 25)
                    return false;

                // MessageEmbed に MessageEmbedFields が存在するか
                const messageEmbedFieldsNodePos = messageEmbedNodePos.querySelector('messageEmbedFields');
                if (messageEmbedFieldsNodePos) {
                    // MessageEmbedField のインライン状態をすべて取得して、末尾に新しい MessageEmbedField 用のインライン状態を追加
                    const fieldInlines = [
                        ...messageEmbedFieldNodePoses.map((messageEmbedFieldNodePos): boolean => messageEmbedFieldNodePos.node.attrs.inline),
                        true
                    ];

                    // MessageEmbedFields 内にある最後の MessageEmbedField を取得
                    const lastMessageEmbedFieldNodePos = messageEmbedFieldsNodePos.lastChild;

                    let selectionTo = 0;

                    return chain()
                        .insertContentAt(
                            {
                                from: messageEmbedFieldsNodePos.from,
                                to: messageEmbedFieldsNodePos.to - 1
                            },
                            fieldInlines.map((inline, i) => {
                                const { start, end } = getFieldGridColumn(fieldInlines, i);

                                const messageEmbedFieldNodePos = messageEmbedFieldNodePoses.at(i);
                                if (!messageEmbedFieldNodePos) {
                                    selectionTo = `Field #${i + 1} Name`.length;
                                    return Schema.node(
                                        'messageEmbedField',
                                        {
                                            inline,
                                            columnStart: start,
                                            columnEnd: end
                                        },
                                        [
                                            Schema.node(
                                                'messageEmbedFieldName',
                                                {},
                                                Schema.text(`Field #${i + 1} Name`)
                                            ),
                                            Schema.node(
                                                'messageEmbedFieldValue',
                                                {},
                                                Schema.node(
                                                    'paragraph',
                                                    {},
                                                    Schema.text(`Field #${i + 1} Value`)
                                                )
                                            )
                                        ]
                                    );
                                }

                                // MessageEmbedField 内の MessageEmbedFieldName を取得
                                const messageEmbedFieldNameNodePos = messageEmbedFieldNodePos.querySelector('messageEmbedFieldName');
                                const messageEmbedFieldNameNode = messageEmbedFieldNameNodePos?.node;
                                // MessageEmbedField 内の MessageEmbedFieldValue を取得
                                const messageEmbedFieldValueNodePos = messageEmbedFieldNodePos.querySelector('messageEmbedFieldValue');
                                const messageEmbedFieldValueNode = messageEmbedFieldValueNodePos?.node;

                                return Schema.node(
                                    'messageEmbedField',
                                    {
                                        inline,
                                        columnStart: start,
                                        columnEnd: end
                                    },
                                    [
                                        messageEmbedFieldNameNode?.toJSON(),
                                        messageEmbedFieldValueNode?.toJSON()
                                    ]
                                );
                            })
                        )
                        .setTextSelection(lastMessageEmbedFieldNodePos ? {
                            from: lastMessageEmbedFieldNodePos.to + 1,
                            to: lastMessageEmbedFieldNodePos.to + 1 + selectionTo
                        } : currentCursorResolvedPos.pos)
                        .run();
                }

                // MessageEmbed 内の MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthor');

                // MessageEmbed 内の MessageEmbedTitle を取得
                const messageEmbedTitleNodePos = messageEmbedNodePos.querySelector('messageEmbedTitle');

                // MessageEmbed 内の MessageEmbedDescription を取得
                const messageEmbedDescriptionNodePos = messageEmbedNodePos.querySelector('messageEmbedDescription');

                // 要素を挿入する位置
                const insertContentPos = Math.max(
                    messageEmbedNodePos.from,
                    (messageEmbedAuthorNodePos?.to ?? 0) - 1,
                    (messageEmbedTitleNodePos?.to ?? 0) - 1,
                    (messageEmbedDescriptionNodePos?.to ?? 0) - 1
                );

                // MessageEmbedFields が存在しない場合、MessageEmbedFields と MessageEmbedField を追加
                return chain()
                    .insertContentAt(
                        insertContentPos,
                        Schema.node(
                            'messageEmbedFields',
                            {},
                            Schema.node(
                                'messageEmbedField',
                                { inline: true },
                                [
                                    Schema.node(
                                        'messageEmbedFieldName',
                                        {},
                                        Schema.text('Field #1 Name')
                                    ),
                                    Schema.node(
                                        'messageEmbedFieldValue',
                                        {},
                                        Schema.node(
                                            'paragraph',
                                            {},
                                            Schema.text('Field #1 Value')
                                        )
                                    )
                                ]
                            )
                        )
                    )
                    .setTextSelection({
                        from: insertContentPos + 3,
                        to: insertContentPos + 3 + 'Field #1 Name'.length
                    })
                    .run();
            },
            deleteMessageEmbedField: () => ({ editor, state, commands, chain }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedField を取得
                const messageEmbedFieldNodePos = currentCursorNodePos.closest('messageEmbedField');
                if (!messageEmbedFieldNodePos)
                    return false;

                // MessageEmbedField から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = messageEmbedFieldNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedFields が存在するか
                const messageEmbedFieldsNodePos = messageEmbedNodePos.querySelector('messageEmbedFields');
                if (!messageEmbedFieldsNodePos)
                    return false;

                // MessageEmbedFields 内の MessageEmbedField をすべて取得
                const beforeMessageEmbedFieldNodePoses = messageEmbedNodePos.querySelectorAll('messageEmbedField');

                // 削除対象の MessageEmbedField のインデックスを取得
                const deleteFieldIndex = beforeMessageEmbedFieldNodePoses.findIndex((fieldNodePos) => fieldNodePos.from === messageEmbedFieldNodePos.from && (fieldNodePos.to - 1) === messageEmbedFieldNodePos.to);
                if (deleteFieldIndex < 0)
                    return false;

                // MessageEmbedField をすべて取得して、削除対象をフィルタリングする
                const afterMessageEmbedFieldNodePoses = beforeMessageEmbedFieldNodePoses.filter((_, i) => i !== deleteFieldIndex);
                if (afterMessageEmbedFieldNodePoses.length < 1) {
                    return commands.deleteRange({
                        from: messageEmbedFieldsNodePos.from - 1,
                        to: messageEmbedFieldsNodePos.to - 1
                    });
                }

                // MessageEmbedField のインライン状態をすべて取得
                const fieldInlines = afterMessageEmbedFieldNodePoses.map((messageEmbedFieldNodePos): boolean => messageEmbedFieldNodePos.node.attrs.inline);

                // 削除対象の MessageEmbedField のサイズを取得
                const deleteFieldSize = beforeMessageEmbedFieldNodePoses[deleteFieldIndex].size;

                // 対象の MessageEmbedField を削除した後に選択する MessageEmbedField のインデックスを取得
                const selectionIndex = deleteFieldIndex === beforeMessageEmbedFieldNodePoses.length - 1 ? afterMessageEmbedFieldNodePoses.length - 1 : deleteFieldIndex;
                // 対象の MessageEmbedField を削除した後に選択する MessageEmbedField の方向を取得（削除対象を基準とした方向）
                const selectionDirection = deleteFieldIndex === beforeMessageEmbedFieldNodePoses.length - 1 ? 'backward' : 'forward';

                let selectionFrom = 0;
                let selectionTo = 0;

                return chain()
                    .insertContentAt(
                        {
                            from: messageEmbedFieldsNodePos.from,
                            to: messageEmbedFieldsNodePos.to - 1
                        },
                        afterMessageEmbedFieldNodePoses.map((fieldNodePos, i) => {
                            const inline = fieldInlines[i];
                            const { start, end } = getFieldGridColumn(fieldInlines, i);

                            // MessageEmbedField 内の MessageEmbedFieldName を取得
                            const messageEmbedFieldNameNodePos = fieldNodePos.querySelector('messageEmbedFieldName');
                            const messageEmbedFieldNameNode = messageEmbedFieldNameNodePos?.node;
                            // MessageEmbedField 内の MessageEmbedFieldValue を取得
                            const messageEmbedFieldValueNodePos = fieldNodePos.querySelector('messageEmbedFieldValue');
                            const messageEmbedFieldValueNode = messageEmbedFieldValueNodePos?.node;

                            if (i === selectionIndex) {
                                selectionFrom = selectionDirection === 'backward' ? messageEmbedFieldNameNodePos?.from ?? 0 : (messageEmbedFieldNameNodePos?.from ?? 0) - deleteFieldSize;
                                selectionTo = selectionDirection === 'backward' ? messageEmbedFieldNameNodePos?.to ?? 0 : (messageEmbedFieldNameNodePos?.to ?? 0) - deleteFieldSize;
                            }

                            return Schema.node(
                                'messageEmbedField',
                                {
                                    inline,
                                    columnStart: start,
                                    columnEnd: end
                                },
                                [
                                    messageEmbedFieldNameNode?.toJSON(),
                                    messageEmbedFieldValueNode?.toJSON()
                                ]
                            );
                        })
                    )
                    .setTextSelection({
                        from: selectionFrom,
                        to: selectionTo - 1
                    })
                    .run();
            },
            setMessageEmbedFieldInline: (inline) => ({ editor, state, chain }) => {
                // 現在の選択範囲を取得
                const { $from, $to } = state.selection;

                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedField を取得
                const messageEmbedFieldNodePos = currentCursorNodePos.closest('messageEmbedField');
                if (!messageEmbedFieldNodePos)
                    return false;

                // MessageEmbedField から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = messageEmbedFieldNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed 内の MessageEmbedFields を取得
                const messageEmbedFieldsNodePos = messageEmbedNodePos.querySelector('messageEmbedFields');
                if (!messageEmbedFieldsNodePos)
                    return false;

                // MessageEmbedFields 内の MessageEmbedField をすべて取得
                const messageEmbedFieldNodePoses = messageEmbedNodePos.querySelectorAll('messageEmbedField');
                if (messageEmbedFieldNodePoses.length < 1)
                    return false;

                // 変更対象の MessageEmbedField のインデックスを取得
                const updateFieldIndex = messageEmbedFieldNodePoses.findIndex((fieldNodePos) => fieldNodePos.from === messageEmbedFieldNodePos.from && (fieldNodePos.to - 1) === messageEmbedFieldNodePos.to);
                if (updateFieldIndex < 0)
                    return false;

                // MessageEmbedField のインライン状態をすべて取得
                const fieldInlines = messageEmbedFieldNodePoses.map((messageEmbedFieldNodePos): boolean => messageEmbedFieldNodePos.node.attrs.inline);

                // 変更対象の MessageEmbedField のインライン状態を変更
                fieldInlines[updateFieldIndex] = inline;

                return chain()
                    .insertContentAt(
                        {
                            from: messageEmbedFieldsNodePos.from,
                            to: messageEmbedFieldsNodePos.to - 1
                        },
                        messageEmbedFieldNodePoses.map((fieldNodePos, i) => {
                            const inline = fieldInlines[i];
                            const { start, end } = getFieldGridColumn(fieldInlines, i);

                            // MessageEmbedField 内の MessageEmbedFieldName を取得
                            const messageEmbedFieldNameNodePos = fieldNodePos.querySelector('messageEmbedFieldName');
                            const messageEmbedFieldNameNode = messageEmbedFieldNameNodePos?.node;
                            // MessageEmbedField 内の MessageEmbedFieldValue を取得
                            const messageEmbedFieldValueNodePos = fieldNodePos.querySelector('messageEmbedFieldValue');
                            const messageEmbedFieldValueNode = messageEmbedFieldValueNodePos?.node;

                            return Schema.node(
                                'messageEmbedField',
                                {
                                    inline,
                                    columnStart: start,
                                    columnEnd: end
                                },
                                [
                                    messageEmbedFieldNameNode?.toJSON(),
                                    messageEmbedFieldValueNode?.toJSON()
                                ]
                            );
                        })
                    )
                    .setTextSelection({
                        from: $from.pos,
                        to: $to.pos
                    })
                    .run();
            },
            toggleMessageEmbedFieldInline: () => ({ editor, state, commands }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbedField を取得
                const messageEmbedFieldNodePos = currentCursorNodePos.closest('messageEmbedField');
                if (!messageEmbedFieldNodePos)
                    return false;

                // MessageEmbedField のインライン状態を変更
                return commands.setMessageEmbedFieldInline(!(messageEmbedFieldNodePos.attributes.inline));
            }
        };
    },

    addAttributes() {
        return {
            inline: {
                default: false,
                parseHTML: (element) => element.hasAttribute('data-inline') ? element.getAttribute('data-inline') === 'true' : false,
                renderHTML: (attributes) => {
                    return {
                        'data-inline': attributes.inline
                    };
                }
            },
            columnStart: {
                default: 1,
                parseHTML: (element) => {
                    const columnStart = element.getAttribute('data-column-start');
                    if (columnStart)
                        return Number(columnStart);

                    const gridColumn = element.style.gridColumn;
                    if (gridColumn) {
                        const match = /(\d{1,2}) ?\/ ?\d{1,2}/.exec(gridColumn);
                        if (match)
                            return Number(match[1]);
                    }

                    const gridColumnStart = element.style.gridColumnStart;
                    if (gridColumnStart)
                        return Number(gridColumnStart);

                    return 1;
                },
                renderHTML: (attributes) => {
                    return {
                        'data-column-start': attributes.columnStart,
                        style: `grid-column-start: ${attributes.columnStart};`
                    };
                }
            },
            columnEnd: {
                default: 13,
                parseHTML: (element) => {
                    const columnEnd = element.getAttribute('data-column-end');
                    if (columnEnd)
                        return Number(columnEnd);

                    const gridColumn = element.style.gridColumn;
                    if (gridColumn) {
                        const match = /\d{1,2} ?\/ ?(\d{1,2})/.exec(gridColumn);
                        if (match)
                            return Number(match[1]);
                    }

                    const gridColumnEnd = element.style.gridColumnEnd;
                    if (gridColumnEnd)
                        return Number(gridColumnEnd);

                    return 13;
                },
                renderHTML: (attributes) => {
                    return {
                        'data-column-end': attributes.columnEnd,
                        style: `grid-column-end: ${attributes.columnEnd};`
                    };
                }
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFieldRootElement}.${messageEmbedFieldClasses.root}`
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            MessageEmbedFieldRootElement as string,
            mergeAttributes(
                HTMLAttributes,
                {
                    class: messageEmbedFieldClasses.root
                }
            ),
            0
        ];
    }
});
