import { messageEmbedFooterClasses, MessageEmbedFooterRootElement } from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedFooter: {
            setMessageEmbedFooter: () => ReturnType;
            deleteMessageEmbedFooter: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedFooterExtension = Node.create({
    name: 'messageEmbedFooter',

    group: 'layout',

    content: 'messageEmbedFooterIcon? messageEmbedFooterText? messageEmbedFooterSeparator? messageEmbedFooterTimestamp?',

    selectable: false,

    draggable: false,

    addCommands() {
        return {
            setMessageEmbedFooter: () => ({ editor, state, chain }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorPos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorPos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedFooter が存在するか
                const messageEmbedFooterNodePos = messageEmbedNodePos.querySelector('messageEmbedFooter');
                if (messageEmbedFooterNodePos)
                    return false;

                // MessageEmbed 内の MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthor');

                // MessageEmbed 内の MessageEmbedTitle を取得
                const messageEmbedTitleNodePos = messageEmbedNodePos.querySelector('messageEmbedTitle');

                // MessageEmbed 内の MessageEmbedDescription を取得
                const messageEmbedDescriptionNodePos = messageEmbedNodePos.querySelector('messageEmbedDescription');

                // MessageEmbed 内の MessageEmbedFields を取得
                const messageEmbedFieldsNodePos = messageEmbedNodePos.querySelector('messageEmbedFields');

                // MessageEmbed 内の MessageEmbedImage を取得
                const messageEmbedImageNodePos = messageEmbedNodePos.querySelector('messageEmbedImage');

                // MessageEmbed 内の MessageEmbedGallery を取得
                const messageEmbedGalleryNodePos = messageEmbedNodePos.querySelector('messageEmbedGallery');

                // MessageEmbed 内の MessageEmbedThumbnail を取得
                const messageEmbedThumbnailNodePos = messageEmbedNodePos.querySelector('messageEmbedThumbnail');

                // MessageEmbed に MessageEmbedFooter を追加
                return chain()
                    .setNodeSelection(messageEmbedNodePos.from)
                    .insertContentAt(
                        Math.max(
                            messageEmbedNodePos.from,
                            (messageEmbedAuthorNodePos?.to ?? 0) - 1,
                            (messageEmbedTitleNodePos?.to ?? 0) - 1,
                            (messageEmbedDescriptionNodePos?.to ?? 0) - 1,
                            (messageEmbedFieldsNodePos?.to ?? 0) - 1,
                            (messageEmbedImageNodePos?.to ?? 0) - 1,
                            (messageEmbedGalleryNodePos?.to ?? 0) - 1,
                            (messageEmbedThumbnailNodePos?.to ?? 0) - 1
                        ),
                        Schema.node(
                            'messageEmbedFooter',
                            {},
                            Schema.node('messageEmbedFooterText')
                        )
                    )
                    .run();
            },
            deleteMessageEmbedFooter: () => ({ editor, state, chain }) => {
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
                    return false;

                // MessageEmbed から MessageEmbedFooter を削除
                return chain()
                    .setNodeSelection(messageEmbedNodePos.from)
                    .deleteRange({
                        from: messageEmbedFooterNodePos.from - 1,
                        to: messageEmbedFooterNodePos.to
                    })
                    .run();
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedFooterRootElement}.${messageEmbedFooterClasses.root}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedFooterRootElement as string,
            {
                class: messageEmbedFooterClasses.root
            },
            0
        ];
    }
});
