import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { ImageIcon } from '@/components/icons';
import {
    MessageEditorMessageEmbedExtension,
    MessageEditorMessageEmbedGalleryExtension,
    MessageEditorMessageEmbedGalleryItemExtension,
    MessageEditorMessageEmbedImageExtension
} from '@/components/message_v2';
import { MessageEditorGalleryDialog } from '@/components/message_v2/editor/components/dialogs/gallery';
import { DefaultAvatar } from '@lunaproject/web-discord-components';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorSetMessageEmbedImagesCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'setMessageEmbedImages',
    icon: ImageIcon,
    label: '画像',
    keywords: ['gallery', 'image', 'embed', 'add', 'insert', 'delete', 'remove', 'change', 'update', 'ギャラリー', '画像', '埋め込み', '埋込み', '埋込', '追加', '挿入', '削除', '消去', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedImages(DefaultAvatar.Blurple),
    selected: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
        const messageEmbedNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedExtension.name);
        if (!messageEmbedNodePos)
            return false;

        // MessageEmbed に MessageEmbedImage が存在するか
        const messageEmbedImageNodePos = messageEmbedNodePos.querySelector(MessageEditorMessageEmbedImageExtension.name);
        // MessageEmbed に MessageEmbedGallery が存在するか
        const messageEmbedGalleryNodePos = messageEmbedNodePos.querySelector(MessageEditorMessageEmbedGalleryExtension.name);

        return messageEmbedImageNodePos !== null || messageEmbedGalleryNodePos !== null;
    },
    perform: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
        const messageEmbedNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedExtension.name);
        if (!messageEmbedNodePos)
            return false;

        const initialValues: string[] = [];

        // MessageEmbed 内の MessageEmbedImage を取得
        const messageEmbedImageNodePos = messageEmbedNodePos.querySelector(MessageEditorMessageEmbedImageExtension.name);
        const messageEmbedImageNode = messageEmbedImageNodePos?.node;
        if (messageEmbedImageNode)
            initialValues.push(messageEmbedImageNode.attrs.src);

        // MessageEmbed 内の MessageEmbedGallery を取得
        const messageEmbedGalleryNodePos = messageEmbedNodePos.querySelector(MessageEditorMessageEmbedGalleryExtension.name);
        const messageEmbedGalleryNode = messageEmbedGalleryNodePos?.node;
        if (messageEmbedGalleryNode) {
            const messageEmbedGalleryItemNodePoses = messageEmbedGalleryNodePos.querySelectorAll(MessageEditorMessageEmbedGalleryItemExtension.name);
            for (const messageEmbedGalleryItemNodePos of messageEmbedGalleryItemNodePoses)
                initialValues.push(messageEmbedGalleryItemNodePos.node.attrs.src);
        }

        MessageEditorGalleryDialog.call({ values: initialValues }).then((result) => {
            if (result.type === 'cancel')
                return;

            const currentChain = editor.chain().focus();

            if (result.type === 'set')
                currentChain.setMessageEmbedImages(result.values);
            else
                currentChain.deleteMessageEmbedImages();

            currentChain.run();
        });

        return true;
    }
});

export const MessageEditorSetMessageEmbedImagesRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        MessageEditorSetMessageEmbedImagesCommand(localization),
        {
            label: undefined,
            accessKey: 'I',
            tooltip: {
                children: '画像'
            }
        }
    );
};
