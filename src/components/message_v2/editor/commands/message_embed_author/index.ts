import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { DeleteIcon, ImageIcon, LinkIcon, PersonIcon } from '@/components/icons';
import {
    MessageEditorMessageEmbedAuthorExtension,
    MessageEditorMessageEmbedAuthorIconExtension,
    MessageEditorMessageEmbedAuthorNameExtension,
    MessageEditorUrlDialog
} from '@/components/message_v2';
import { DefaultAvatar } from '@lunaproject/web-discord-components';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorInsertMessageEmbedAuthorCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertMessageEmbedAuthor',
    icon: PersonIcon,
    label: translations.embed_author,
    keywords: ['author', 'header', 'embed', 'add', 'insert', '著者', '作者', 'ヘッダー', '埋め込み', '埋込み', '埋込', '追加', '挿入'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedAuthor(),
    perform: ({ editor }) => editor.chain().focus().setMessageEmbedAuthor().run()
});

export const MessageEditorDeleteMessageEmbedAuthorCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'deleteMessageEmbedAuthor',
    icon: DeleteIcon,
    label: translations.delete,
    keywords: ['author', 'header', 'embed', 'delete', 'remove', '著者', '作者', 'ヘッダー', '埋め込み', '埋込み', '埋込', '削除', '消去'],
    disabled: ({ editor }) => !editor.can().deleteMessageEmbedAuthor(),
    perform: ({ editor }) => editor.chain().focus().deleteMessageEmbedAuthor().run()
});

export const MessageEditorSetMessageEmbedAuthorUrlCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'setMessageEmbedAuthorUrl',
    icon: LinkIcon,
    label: 'リンク',
    keywords: ['url', 'link', 'author', 'header', 'embed', 'change', 'update', 'URL', 'リンク', '著者', '作者', 'ヘッダー', '埋め込み', '埋込み', '埋込', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedAuthorUrl(''),
    selected: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);
        const currentCursorNode = currentCursorNodePos.node;

        // 現在のカーソル位置の要素が MessageEmbedAuthorName であるか
        if (currentCursorNode.type.name !== MessageEditorMessageEmbedAuthorNameExtension.name)
            return false;

        // MessageEmbedAuthorName に属性が設定されているか
        const url: string | null = currentCursorNode.attrs.url;
        return url !== null && url.length > 0;
    },
    perform: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);
        const currentCursorNode = currentCursorNodePos.node;

        // 現在のカーソル位置の要素が MessageEmbedAuthorName であるか
        if (currentCursorNode.type.name !== MessageEditorMessageEmbedAuthorNameExtension.name)
            return false;

        MessageEditorUrlDialog.call({ value: currentCursorNode.attrs.url }).then((result) => {
            if (result.type === 'cancel')
                return;

            editor
                .chain()
                .focus()
                .setMessageEmbedAuthorUrl(result.type === 'set' ? result.value : undefined)
                .run();
        });

        return true;
    }
});

export const MessageEditorSetMessageEmbedAuthorIconCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'setMessageEmbedAuthorIcon',
    icon: ImageIcon,
    label: 'アイコン',
    keywords: ['icon', 'image', 'author', 'embed', 'change', 'update', 'アイコン', '画像', '著者', '作者', '埋め込み', '埋込み', '埋込', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedAuthorIcon(DefaultAvatar.Blurple) && !editor.can().deleteMessageEmbedAuthorIcon(),
    selected: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbedAuthor を取得
        const messageEmbedAuthorNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedAuthorExtension.name);
        if (!messageEmbedAuthorNodePos)
            return false;

        // MessageEmbedAuthor に MessageEmbedAuthorIcon が存在するか
        return messageEmbedAuthorNodePos.querySelector(MessageEditorMessageEmbedAuthorIconExtension.name) !== null;
    },
    perform: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

        // 現在のカーソル位置から親に向かって一番近い MessageEmbedAuthor を取得
        const messageEmbedAuthorNodePos = currentCursorNodePos.closest(MessageEditorMessageEmbedAuthorExtension.name);
        if (!messageEmbedAuthorNodePos)
            return false;

        // MessageEmbedAuthor 内の MessageEmbedAuthorIcon を取得
        const messageEmbedAuthorIconNodePos = messageEmbedAuthorNodePos.querySelector(MessageEditorMessageEmbedAuthorIconExtension.name);
        const messageEmbedAuthorIconNode = messageEmbedAuthorIconNodePos?.node;

        MessageEditorUrlDialog.call({ value: messageEmbedAuthorIconNode?.attrs.src }).then((result) => {
            if (result.type === 'cancel')
                return;

            const currentChain = editor.chain().focus();

            if (result.type === 'set')
                currentChain.setMessageEmbedAuthorIcon(result.value);
            else
                currentChain.deleteMessageEmbedAuthorIcon();

            currentChain.run();
        });

        return true;
    }
});

export const MessageEditorInsertMessageEmbedAuthorRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        MessageEditorInsertMessageEmbedAuthorCommand(localization),
        {
            label: undefined,
            accessKey: 'A',
            tooltip: {
                children: translations.embed_author
            }
        }
    );
};

export const MessageEditorDeleteMessageEmbedAuthorRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorDeleteMessageEmbedAuthorCommand(localization),
    {
        accessKey: 'D'
    }
);

export const MessageEditorSetMessageEmbedAuthorUrlRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorSetMessageEmbedAuthorUrlCommand(localization),
    {
        accessKey: 'L'
    }
);

export const MessageEditorSetMessageEmbedAuthorIconRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorSetMessageEmbedAuthorIconCommand(localization),
    {
        accessKey: 'I'
    }
);
