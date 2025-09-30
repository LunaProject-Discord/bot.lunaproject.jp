import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { DeleteIcon, SegmentIcon } from '@/components/icons';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorInsertMessageEmbedFieldCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertMessageEmbedField',
    icon: SegmentIcon,
    label: translations.embed_field,
    keywords: ['field', 'section', 'embed', 'add', 'insert', 'フィールド', 'セクション', '埋め込み', '埋込み', '埋込', '追加', '挿入'],
    disabled: ({ editor }) => !editor.can().addMessageEmbedField(),
    perform: ({ editor }) => editor.chain().focus().addMessageEmbedField().run()
});

export const MessageEditorDeleteMessageEmbedFieldCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'deleteMessageEmbedField',
    icon: DeleteIcon,
    label: translations.delete,
    keywords: ['field', 'section', 'embed', 'delete', 'remove', 'フィールド', 'セクション', '埋め込み', '埋込み', '埋込', '削除', '消去'],
    disabled: ({ editor }) => !editor.can().deleteMessageEmbedField(),
    perform: ({ editor }) => editor.chain().focus().deleteMessageEmbedField().run()
});

export const MessageEditorToggleMessageEmbedFieldInlineCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'toggleMessageEmbedFieldInline',
    label: translations.embed_field_inline,
    keywords: ['inline', 'field', 'section', 'embed', 'toggle', 'change', 'update', 'インライン', 'フィールド', 'セクション', '埋め込み', '埋込み', '埋込', '切り替え', '切替', 'トグル', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().toggleMessageEmbedFieldInline(),
    selected: ({ editor }) => editor.isActive('messageEmbedField', { inline: true }),
    perform: ({ editor }) => editor.chain().focus().toggleMessageEmbedFieldInline().run()
});

export const MessageEditorInsertMessageEmbedFieldRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorInsertMessageEmbedFieldCommand(localization),
    {
        accessKey: 'F'
    }
);

export const MessageEditorDeleteMessageEmbedFieldRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorDeleteMessageEmbedFieldCommand(localization),
    {
        accessKey: 'D'
    }
);

export const MessageEditorToggleMessageEmbedFieldInlineRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorToggleMessageEmbedFieldInlineCommand(localization),
    {
        accessKey: 'I'
    }
);
