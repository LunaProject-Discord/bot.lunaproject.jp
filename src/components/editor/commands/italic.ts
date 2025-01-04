import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatItalicIcon } from '@/components/icons';
import { asRibbonButton, ItalicCommand } from '@lunaproject/web-editor';

export const EditorItalicCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    ItalicCommand,
    {
        icon: FormatItalicIcon,
        label: translations.italic,
        description: translations.web_page_editor_command_italic_description
    }
);

export const EditorItalicRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorItalicCommand(localization),
        {
            label: undefined,
            accessKey: 'I',
            tooltip: {
                children: translations.italic
            }
        }
    );
};
