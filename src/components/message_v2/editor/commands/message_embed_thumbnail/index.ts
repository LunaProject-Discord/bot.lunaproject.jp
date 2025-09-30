import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { PictureInPictureIcon } from '@/components/icons';
import {
    MessageEditorMessageEmbedExtension,
    MessageEditorMessageEmbedThumbnailExtension,
    MessageEditorUrlDialog
} from '@/components/message_v2';
import { DefaultAvatar } from '@lunaproject/web-discord-components';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorSetMessageEmbedThumbnailCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'setMessageEmbedThumbnail',
    icon: PictureInPictureIcon,
    label: 'サムネイル',
    keywords: ['thumbnail', 'image', 'embed', 'add', 'insert', 'delete', 'remove', 'change', 'update', 'サムネイル', '画像', '埋め込み', '埋込み', '埋込', '追加', '挿入', '削除', '消去', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedThumbnail(DefaultAvatar.Blurple),
    selected: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
        const messageEmbedNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedExtension.name);
        if (!messageEmbedNodePos)
            return false;

        // MessageEmbed に MessageEmbedThumbnail が存在するか
        return messageEmbedNodePos.querySelector(MessageEditorMessageEmbedThumbnailExtension.name) !== null;
    },
    perform: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbed を取得
        const messageEmbedNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedExtension.name);
        if (!messageEmbedNodePos)
            return false;

        // MessageEmbed 内の MessageEmbedThumbnail を取得
        const messageEmbedThumbnailNodePos = messageEmbedNodePos.querySelector(MessageEditorMessageEmbedThumbnailExtension.name);
        const messageEmbedThumbnailNode = messageEmbedThumbnailNodePos?.node;

        MessageEditorUrlDialog.call({ value: messageEmbedThumbnailNode?.attrs.src }).then((result) => {
            if (result.type === 'cancel')
                return;

            const currentChain = editor.chain().focus();

            if (result.type === 'set')
                currentChain.setMessageEmbedThumbnail(result.value);
            else
                currentChain.deleteMessageEmbedThumbnail();

            currentChain.run();
        });

        return true;
    }
});

export const MessageEditorSetMessageEmbedThumbnailRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        MessageEditorSetMessageEmbedThumbnailCommand(localization),
        {
            label: undefined,
            accessKey: 'H',
            tooltip: {
                children: 'サムネイル'
            }
        }
    );
};
