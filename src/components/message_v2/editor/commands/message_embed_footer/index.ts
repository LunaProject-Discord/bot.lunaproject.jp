import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { DeleteIcon, ImageIcon, PageFooterIcon } from '@/components/icons';
import {
    MessageEditorMessageEmbedFooterExtension,
    MessageEditorMessageEmbedFooterIconExtension,
    MessageEditorUrlDialog
} from '@/components/message_v2';
import { DefaultAvatar } from '@lunaproject/web-discord-components';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorInsertMessageEmbedFooterCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertMessageEmbedFooter',
    icon: PageFooterIcon,
    label: translations.embed_footer,
    keywords: ['footer', 'embed', 'add', 'insert', 'フッター', '埋め込み', '埋込み', '埋込', '追加', '挿入'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedFooterText(),
    perform: ({ editor }) => editor.chain().focus().setMessageEmbedFooterText().run()
});

export const MessageEditorDeleteMessageEmbedFooterCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'deleteMessageEmbedFooter',
    icon: DeleteIcon,
    label: translations.delete,
    keywords: ['footer', 'embed', 'delete', 'remove', 'フッター', '埋め込み', '埋込み', '埋込', '削除', '消去'],
    disabled: ({ editor }) => !editor.can().deleteMessageEmbedFooter(),
    perform: ({ editor }) => editor.chain().focus().deleteMessageEmbedFooter().run()
});

export const MessageEditorSetMessageEmbedFooterIconCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'setMessageEmbedFooterIcon',
    icon: ImageIcon,
    label: 'アイコン',
    keywords: ['icon', 'image', 'footer', 'embed', 'change', 'update', 'アイコン', '画像', 'フッター', '埋め込み', '埋込み', '埋込', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedFooterIcon(DefaultAvatar.Blurple) && !editor.can().deleteMessageEmbedFooterIcon(),
    selected: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbedFooter を取得
        const messageEmbedFooterNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedFooterExtension.name);
        if (!messageEmbedFooterNodePos)
            return false;

        // MessageEmbedFooter に MessageEmbedFooterIcon が存在するか
        return messageEmbedFooterNodePos.querySelector(MessageEditorMessageEmbedFooterIconExtension.name) !== null;
    },
    perform: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbedFooter を取得
        const messageEmbedFooterNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedFooterExtension.name);
        if (!messageEmbedFooterNodePos)
            return false;

        // MessageEmbedFooter 内の MessageEmbedFooterIcon を取得
        const messageEmbedFooterIconNodePos = messageEmbedFooterNodePos.querySelector(MessageEditorMessageEmbedFooterIconExtension.name);
        const messageEmbedFooterIconNode = messageEmbedFooterIconNodePos?.node;

        MessageEditorUrlDialog.call({ value: messageEmbedFooterIconNode?.attrs.src }).then((result) => {
            if (result.type === 'cancel')
                return;

            const currentChain = editor.chain().focus();

            if (result.type === 'set')
                currentChain.setMessageEmbedFooterIcon(result.value);
            else
                currentChain.deleteMessageEmbedFooterIcon();

            currentChain.run();
        });

        return true;
    }
});

export const MessageEditorInsertMessageEmbedFooterRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        MessageEditorInsertMessageEmbedFooterCommand(localization),
        {
            label: undefined,
            accessKey: 'O',
            tooltip: {
                children: translations.embed_footer
            }
        }
    );
};

export const MessageEditorDeleteMessageEmbedFooterRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorDeleteMessageEmbedFooterCommand(localization),
    {
        accessKey: 'D'
    }
);

export const MessageEditorSetMessageEmbedFooterIconRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorSetMessageEmbedFooterIconCommand(localization),
    {
        accessKey: 'I'
    }
);
