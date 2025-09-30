import {
    getFieldGridColumn,
    messageEmbedClasses,
    MessageEmbedFieldsElement
} from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedFields: {
            calcMessageEmbedFields: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedFieldsExtension = Node.create({
    name: 'messageEmbedFields',

    group: 'layout',

    content: 'messageEmbedField+',

    selectable: false,

    draggable: false,

    addCommands() {
        return {
            calcMessageEmbedFields: () => ({ editor, state, chain }) => {
                // 現在の選択範囲を取得
                const { $from, $to } = state.selection;

                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorPos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorPos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed 内の MessageEmbedFields を取得
                const messageEmbedFieldsNodePos = messageEmbedNodePos.querySelector('messageEmbedFields');
                if (!messageEmbedFieldsNodePos)
                    return false;

                // MessageEmbedFields 内の MessageEmbedField をすべて取得
                const messageEmbedFieldNodePoses = messageEmbedFieldsNodePos.querySelectorAll('messageEmbedField');
                if (messageEmbedFieldNodePoses.length < 1)
                    return false;

                // MessageEmbedField のインライン状態をすべて取得
                const fieldInlines = messageEmbedFieldNodePoses.map((messageEmbedFieldNodePos): boolean => messageEmbedFieldNodePos.node.attrs.inline);

                return chain()
                    .insertContentAt(
                        {
                            from: messageEmbedFieldsNodePos.from,
                            to: messageEmbedFieldsNodePos.to - 1
                        },
                        messageEmbedFieldNodePoses.map((messageEmbedFieldNodePos, i) => {
                            const inline = fieldInlines[i];
                            const { start, end } = getFieldGridColumn(fieldInlines, i);

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
                    .setTextSelection({
                        from: $from.pos,
                        to: $to.pos
                    })
                    .run();
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFieldsElement}.${messageEmbedClasses.fields}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedFieldsElement as string,
            {
                class: messageEmbedClasses.fields
            },
            0
        ];
    }
});
