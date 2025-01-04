import {
    insertContentAfter,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatAlignLeftIcon } from '@/components/icons';
import { asRibbonButton } from '@lunaproject/web-editor';

export const EditorInsertParagraphCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertParagraph',
    icon: FormatAlignLeftIcon,
    label: translations.paragraph,
    description: translations.web_page_editor_command_insert_paragraph_description,
    keywords: ['paragraph', 'line', 'add', 'insert', '段落', '行', '追加', '挿入'],
    perform: insertContentAfter({ type: 'paragraph' })
});

export const EditorInsertParagraphRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertParagraphCommand(localization),
    {
        accessKey: 'P'
    }
);
