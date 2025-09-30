import {
    DefaultAvatar,
    messageEmbedThumbnailClasses,
    MessageEmbedThumbnailImageElement,
    MessageEmbedThumbnailRootElement
} from '@lunaproject/web-discord-components';
import { Schema } from '@lunaproject/web-editor';
import { mergeAttributes, Node } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface MessageEditorMessageEmbedThumbnailExtensionOptions {
    defaultSrc: string;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        messageEmbedThumbnail: {
            setMessageEmbedThumbnail: (src: string) => ReturnType;
            deleteMessageEmbedThumbnail: () => ReturnType;
        };
    }
}

export const MessageEditorMessageEmbedThumbnailExtension = Node.create<MessageEditorMessageEmbedThumbnailExtensionOptions>({
    name: 'messageEmbedThumbnail',

    group: 'layout',

    selectable: false,

    draggable: false,

    addOptions() {
        return {
            defaultSrc: DefaultAvatar.Blurple
        };
    },

    addCommands() {
        return {
            setMessageEmbedThumbnail: (src) => ({ editor, state, chain }) => {
                if (src.length < 1)
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

                // 共通のコンテンツ
                const content = Schema.node(
                    'messageEmbedThumbnail',
                    {
                        src
                    }
                );

                // MessageEmbed に MessageEmbedThumbnail が存在するか
                const messageEmbedThumbnailNodePos = messageEmbedNodePos.querySelector('messageEmbedThumbnail');
                if (messageEmbedThumbnailNodePos) {
                    return chain()
                        .insertContentAt(
                            {
                                from: messageEmbedThumbnailNodePos.from,
                                to: messageEmbedThumbnailNodePos.to
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

                // MessageEmbed 内の MessageEmbedImage を取得
                const messageEmbedImageNodePos = messageEmbedNodePos.querySelector('messageEmbedImage');

                // MessageEmbed 内の MessageEmbedGallery を取得
                const messageEmbedGalleryNodePos = messageEmbedNodePos.querySelector('messageEmbedGallery');

                // MessageEmbed に MessageEmbedThumbnail を追加
                return chain()
                    .insertContentAt(
                        Math.max(
                            messageEmbedNodePos.from,
                            (messageEmbedAuthorNodePos?.to ?? 0) - 1,
                            (messageEmbedTitleNodePos?.to ?? 0) - 1,
                            (messageEmbedDescriptionNodePos?.to ?? 0) - 1,
                            (messageEmbedFieldsNodePos?.to ?? 0) - 1,
                            (messageEmbedImageNodePos?.to ?? 0),
                            (messageEmbedGalleryNodePos?.to ?? 0)
                        ),
                        content
                    )
                    .setTextSelection({
                        from: $from.pos,
                        to: $to.pos
                    })
                    .run();
            },
            deleteMessageEmbedThumbnail: () => ({ editor, state, chain }) => {
                // 現在の選択範囲を取得
                const { $from, $to } = state.selection;

                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
                const messageEmbedNodePos = currentCursorNodePos.closest('messageEmbed');
                if (!messageEmbedNodePos)
                    return false;

                // MessageEmbed 内の MessageEmbedThumbnail を取得
                const messageEmbedThumbnailNodePos = messageEmbedNodePos.querySelector('messageEmbedThumbnail');
                if (!messageEmbedThumbnailNodePos)
                    return false;

                // MessageEmbed から MessageEmbedThumbnail を削除
                return chain()
                    .deleteRange({
                        from: messageEmbedThumbnailNodePos.from,
                        to: messageEmbedThumbnailNodePos.to
                    })
                    .setTextSelection({
                        from: $from.pos,
                        to: $to.pos
                    })
                    .run();
            }
        };
    },

    addAttributes() {
        return {
            src: {
                default: this.options.defaultSrc,
                parseHTML: (element) => {
                    const imageElement = element.querySelector<HTMLImageElement>(`${MessageEmbedThumbnailImageElement}.${messageEmbedThumbnailClasses.image}`);
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
                tag: `${MessageEmbedThumbnailRootElement}.${messageEmbedThumbnailClasses.root}`,
                getAttrs: (element) => {
                    const imageElement = element.querySelector<HTMLImageElement>(`${MessageEmbedThumbnailImageElement}.${messageEmbedThumbnailClasses.image}`);
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
                tag: `${MessageEmbedThumbnailImageElement}.${messageEmbedThumbnailClasses.image}`,
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
            MessageEmbedThumbnailRootElement as string,
            {
                contenteditable: 'false',
                class: messageEmbedThumbnailClasses.root
            },
            [
                MessageEmbedThumbnailImageElement as string,
                mergeAttributes(
                    HTMLAttributes,
                    {
                        class: messageEmbedThumbnailClasses.image
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

                            const classNames = Object.values(messageEmbedThumbnailClasses);
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
