import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { CodeIcon } from '@/components/icons';
import { asRibbonButton, CodeCommand } from '@lunaproject/web-editor';

export const EditorCodeCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    CodeCommand,
    {
        icon: CodeIcon,
        label: translations.inline_code,
        description: translations.web_page_editor_command_inline_code_description
    }
);

export const EditorCodeRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorCodeCommand(localization),
        {
            label: undefined,
            accessKey: 'C',
            tooltip: {
                children: translations.inline_code
            }
        }
    );
};
