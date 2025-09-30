import { messageEmbedGalleryClasses, MessageEmbedGalleryRootElement } from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedGallery: {
            setMessageEmbedImages: (src: string | string[]) => ReturnType;
            deleteMessageEmbedImages: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedGalleryExtension = Node.create({
    name: 'messageEmbedGallery',

    group: 'layout',

    content: 'messageEmbedGalleryItem{2,4}',

    selectable: false,

    draggable: false,

    addCommands() {
        return {
            setMessageEmbedImages: (src) => ({ editor, state, chain }) => {
                // 共通のコンテンツ
                let content: ReturnType<typeof Schema.node> | undefined = undefined;

                if (Array.isArray(src)) {
                    const images = src.filter((s) => s.length > 0);
                    if (images.length < 1 || images.length > 4)
                        return false;

                    content = images.length > 1 ? Schema.node(
                        'messageEmbedGallery',
                        {},
                        images.map((image) => Schema.node(
                            'messageEmbedGalleryItem',
                            {
                                src: image
                            }
                        ))
                    ) : Schema.node(
                        'messageEmbedImage',
                        {
                            src: images[0]
                        }
                    );
                } else {
                    if (src.length < 1)
                        return false;

                    content = Schema.node(
                        'messageEmbedImage',
                        {
                            src
                        }
                    );
                }

                if (!content)
                    return false;

                // 現在の選択範囲を取得
                const { $from, $to } = state.selection;

                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedImage が存在するか
                const messageEmbedImageNodePos = messageEmbedNodePos.querySelector('messageEmbedImage');
                // MessageEmbed に MessageEmbedGallery が存在するか
                const messageEmbedGalleryNodePos = messageEmbedNodePos.querySelector('messageEmbedGallery');
                if (messageEmbedImageNodePos || messageEmbedGalleryNodePos) {
                    return chain()
                        .insertContentAt(
                            {
                                from: (messageEmbedImageNodePos || messageEmbedGalleryNodePos)!.from - 1,
                                to: (messageEmbedImageNodePos || messageEmbedGalleryNodePos)!.to
                            },
                            content
                        )
                        .setTextSelection({
                            from: $from.pos,
                            to: $to.pos
                        })
                        .run();
                }

                // MessageEmbed 内の MessageEmbedAuthor を取得
                const messageEmbedAuthorNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthor');

                // MessageEmbed 内の MessageEmbedTitle を取得
                const messageEmbedTitleNodePos = messageEmbedNodePos.querySelector('messageEmbedTitle');

                // MessageEmbed 内の MessageEmbedDescription を取得
                const messageEmbedDescriptionNodePos = messageEmbedNodePos.querySelector('messageEmbedDescription');

                // MessageEmbed 内の MessageEmbedFields を取得
                const messageEmbedFieldsNodePos = messageEmbedNodePos.querySelector('messageEmbedFields');

                // MessageEmbed に MessageEmbedThumbnail を追加
                return chain()
                    .insertContentAt(
                        Math.max(
                            messageEmbedNodePos.from,
                            (messageEmbedAuthorNodePos?.to ?? 0) - 1,
                            (messageEmbedTitleNodePos?.to ?? 0) - 1,
                            (messageEmbedDescriptionNodePos?.to ?? 0) - 1,
                            (messageEmbedFieldsNodePos?.to ?? 0) - 1
                        ),
                        content
                    )
                    .setTextSelection({
                        from: $from.pos,
                        to: $to.pos
                    })
                    .run();
            },
            deleteMessageEmbedImages: () => ({ editor, state, chain }) => {
                // 現在の選択範囲を取得
                const { $from, $to } = state.selection;

                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed に MessageEmbedImage が存在するか
                const messageEmbedImageNodePos = messageEmbedNodePos.querySelector('messageEmbedImage');
                if (messageEmbedImageNodePos) {
                    return chain()
                        .deleteRange({
                            from: messageEmbedImageNodePos.from - 1,
                            to: messageEmbedImageNodePos.to
                        })
                        .setTextSelection({
                            from: $from.pos,
                            to: $to.pos
                        })
                        .run();
                }

                // MessageEmbed に MessageEmbedGallery が存在するか
                const messageEmbedGalleryNodePos = messageEmbedNodePos.querySelector('messageEmbedGallery');
                if (messageEmbedGalleryNodePos) {
                    return chain()
                        .deleteRange({
                            from: messageEmbedGalleryNodePos.from - 1,
                            to: messageEmbedGalleryNodePos.to
                        })
                        .setTextSelection({
                            from: $from.pos,
                            to: $to.pos
                        })
                        .run();
                }

                return false;
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${MessageEmbedGalleryRootElement}.${messageEmbedGalleryClasses.root}`
            }
        ];
    },

    renderHTML() {
        return [
            MessageEmbedGalleryRootElement as string,
            {
                class: messageEmbedGalleryClasses.root
            },
            0
        ];
    }
});
