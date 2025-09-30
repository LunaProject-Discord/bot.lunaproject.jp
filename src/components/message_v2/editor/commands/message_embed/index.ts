import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { DeleteIcon, DockToRightFillIcon } from '@/components/icons';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorInsertMessageEmbedCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertMessageEmbed',
    icon: DockToRightFillIcon,
    label: 'Embed',
    keywords: ['embed', 'add', 'insert', '埋め込み', '埋込み', '埋込', '追加', '挿入'],
    disabled: ({ editor }) => !editor.can().addMessageEmbed(),
    perform: ({ editor }) => editor.chain().focus().addMessageEmbed().run()
});

export const MessageEditorDeleteMessageEmbedCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'deleteMessageEmbed',
    icon: DeleteIcon,
    label: translations.delete,
    keywords: ['embed', 'delete', 'remove', '埋め込み', '埋込み', '埋込', '削除', '消去'],
    disabled: ({ editor }) => !editor.can().deleteMessageEmbed(),
    perform: ({ editor }) => editor.chain().focus().deleteMessageEmbed().run()
});

export const MessageEditorInsertMessageEmbedRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorInsertMessageEmbedCommand(localization),
    {
        accessKey: 'E'
    }
);

export const MessageEditorDeleteMessageEmbedRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorDeleteMessageEmbedCommand(localization),
    {
        accessKey: 'D'
    }
);
