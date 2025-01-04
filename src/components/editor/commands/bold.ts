import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatBoldIcon } from '@/components/icons';
import { asRibbonButton, BoldCommand } from '@lunaproject/web-editor';

export const EditorBoldCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    BoldCommand,
    {
        icon: FormatBoldIcon,
        label: translations.bold,
        description: translations.web_page_editor_command_bold_description
    }
);

export const EditorBoldRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorBoldCommand(localization),
        {
            label: undefined,
            accessKey: 'B',
            tooltip: {
                children: translations.bold
            }
        }
    );
};
