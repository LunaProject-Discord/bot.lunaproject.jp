import { messageEmbedFooterClasses, MessageEmbedFooterTextElement } from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedFooterText: {
            setMessageEmbedFooterText: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedFooterTextExtension = Node.create({
    name: 'messageEmbedFooterText',

    group: 'layout',

    content: '(text|placeholder|lineBreak)*',

    marks: '',

    addCommands() {
        return {
            setMessageEmbedFooterText: () => ({ editor, state, commands, chain }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorPos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorPos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedFooter が存在するか
                const messageEmbedFooterNodePos = messageEmbedNodePos.querySelector('messageEmbedFooter');
                if (!messageEmbedFooterNodePos)
                    return commands.setMessageEmbedFooter();

                // MessageEmbedFooter に MessageEmbedFooterText が存在するか
                const messageEmbedFooterTextNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterText');
                if (messageEmbedFooterTextNodePos)
                    return false;

                // MessageEmbedFooter の MessageEmbedFooterIcon を取得
                const messageEmbedFooterIconNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterIcon');

                // 共通のコンテンツ
                const content = [
                    Schema.node('messageEmbedFooterText')
                ];

                // MessageEmbedFooter に MessageEmbedFooterTimestamp が存在するか
                const messageEmbedFooterTimestampNodePos = messageEmbedFooterNodePos.querySelector('messageEmbedFooterTimestamp');
                if (messageEmbedFooterTimestampNodePos)
                    content.push(Schema.node('messageEmbedFooterSeparator'));

                return chain()
                    .setNodeSelection(messageEmbedNodePos.from)
                    .insertContentAt(
                        Math.max(
                            messageEmbedFooterNodePos.from,
                            (messageEmbedFooterIconNodePos?.to ?? 0) - 1
                        ),
                        content
                    )
                    .run();
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFooterTextElement}.${messageEmbedFooterClasses.text}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedFooterTextElement as string,
            {
                class: messageEmbedFooterClasses.text
            },
            0
        ];
    },

    addKeyboardShortcuts() {
        return {
            'Enter': ({ editor }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = editor.state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);
                const currentCursorNode = currentCursorNodePos.node;

                // 現在のカーソル位置の要素が MessageEmbedFooterText であるか
                if (currentCursorNode.type.name !== 'messageEmbedFooterText')
                    return false;

                return editor.commands.setLineBreak();
            }
        };
    }
});
