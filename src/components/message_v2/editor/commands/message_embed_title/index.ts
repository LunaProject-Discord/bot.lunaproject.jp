import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { DeleteIcon, LinkIcon, TitleIcon } from '@/components/icons';
import { MessageEditorMessageEmbedTitleExtension, MessageEditorUrlDialog } from '@/components/message_v2';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorInsertMessageEmbedTitleCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertMessageEmbedTitle',
    icon: TitleIcon,
    label: translations.embed_body_title,
    keywords: ['title', 'embed', 'add', 'insert', 'タイトル', '埋め込み', '埋込み', '埋込', '追加', '挿入'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedTitle(),
    perform: ({ editor }) => editor.chain().focus().setMessageEmbedTitle().run()
});

export const MessageEditorDeleteMessageEmbedTitleCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'deleteMessageEmbedTitle',
    icon: DeleteIcon,
    label: translations.delete,
    keywords: ['title', 'embed', 'delete', 'remove', 'タイトル', '埋め込み', '埋込み', '埋込', '削除', '消去'],
    disabled: ({ editor }) => !editor.can().deleteMessageEmbedTitle(),
    perform: ({ editor }) => editor.chain().focus().deleteMessageEmbedTitle().run()
});

export const MessageEditorSetMessageEmbedTitleUrlCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'setMessageEmbedTitleUrl',
    icon: LinkIcon,
    label: 'リンク',
    keywords: ['url', 'link', 'title', 'embed', 'change', 'update', 'URL', 'リンク', 'タイトル', '埋め込み', '埋込み', '埋込', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedTitleUrl(''),
    selected: ({ editor, state }) => {
        // 現在のカーソル位置を取得
        const currentCursorResolvedPos = state.selection.$head;
        const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);
        const currentCursorNode = currentCursorNodePos.node;

        // 現在のカーソル位置の要素が MessageEmbedTitle であるか
        if (currentCursorNode.type.name !== MessageEditorMessageEmbedTitleExtension.name)
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

        // 現在のカーソル位置の要素が MessageEmbedTitle であるか
        if (currentCursorNode.type.name !== MessageEditorMessageEmbedTitleExtension.name)
            return false;

        MessageEditorUrlDialog.call({ value: currentCursorNode.attrs.url }).then((result) => {
            if (result.type === 'cancel')
                return;

            editor
                .chain()
                .focus()
                .setMessageEmbedTitleUrl(result.type === 'set' ? result.value : undefined)
                .run();
        });

        return true;
    }
});

export const MessageEditorInsertMessageEmbedTitleRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorInsertMessageEmbedTitleCommand(localization),
    {
        accessKey: 'T'
    }
);

export const MessageEditorDeleteMessageEmbedTitleRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorDeleteMessageEmbedTitleCommand(localization),
    {
        accessKey: 'D'
    }
);

export const MessageEditorSetMessageEmbedTitleUrlRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorSetMessageEmbedTitleUrlCommand(localization),
    {
        accessKey: 'L'
    }
);
