import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { SuperscriptIcon } from '@/components/icons';
import { asRibbonButton, SuperscriptCommand } from '@lunaproject/web-editor';

export const EditorSuperscriptCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    SuperscriptCommand,
    {
        icon: SuperscriptIcon,
        label: translations.superscript,
        description: translations.web_page_editor_command_superscript_description
    }
);

export const EditorSuperscriptRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorSuperscriptCommand(localization),
        {
            label: undefined,
            accessKey: 'VT',
            tooltip: {
                children: translations.superscript
            }
        }
    );
};
