import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatUnderlinedIcon } from '@/components/icons';
import { asRibbonButton, UnderlineCommand } from '@lunaproject/web-editor';

export const EditorUnderlineCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    UnderlineCommand,
    {
        icon: FormatUnderlinedIcon,
        label: translations.underline,
        description: translations.web_page_editor_command_underline_description
    }
);

export const EditorUnderlineRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorUnderlineCommand(localization),
        {
            label: undefined,
            accessKey: 'U',
            tooltip: {
                children: translations.underline
            }
        }
    );
};
