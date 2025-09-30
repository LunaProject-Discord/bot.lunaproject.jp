import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { DeleteIcon, DescriptionIcon } from '@/components/icons';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorInsertMessageEmbedDescriptionCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertMessageEmbedDescription',
    icon: DescriptionIcon,
    label: translations.embed_body_description,
    keywords: ['description', 'content', 'embed', 'add', 'insert', '説明', 'コンテンツ', '埋め込み', '埋込み', '埋込', '追加', '挿入'],
    disabled: ({ editor }) => !editor.can().setMessageEmbedDescription(),
    perform: ({ editor }) => editor.chain().focus().setMessageEmbedDescription().run()
});

export const MessageEditorDeleteMessageEmbedDescriptionCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'deleteMessageEmbedDescription',
    icon: DeleteIcon,
    label: translations.delete,
    keywords: ['description', 'content', 'embed', 'delete', 'remove', '説明', 'コンテンツ', '埋め込み', '埋込み', '埋込', '削除', '消去'],
    disabled: ({ editor }) => !editor.can().deleteMessageEmbedDescription(),
    perform: ({ editor }) => editor.chain().focus().deleteMessageEmbedDescription().run()
});

export const MessageEditorInsertMessageEmbedDescriptionRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorInsertMessageEmbedDescriptionCommand(localization),
    {
        accessKey: 'E'
    }
);

export const MessageEditorDeleteMessageEmbedDescriptionRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorDeleteMessageEmbedDescriptionCommand(localization),
    {
        accessKey: 'D'
    }
);
