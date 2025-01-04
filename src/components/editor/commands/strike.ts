import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatStrikethroughIcon } from '@/components/icons';
import { asRibbonButton, StrikeCommand } from '@lunaproject/web-editor';

export const EditorStrikeCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    StrikeCommand,
    {
        icon: FormatStrikethroughIcon,
        label: translations.strikethrough,
        description: translations.web_page_editor_command_strikethrough_description
    }
);

export const EditorStrikeRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorStrikeCommand(localization),
        {
            label: undefined,
            accessKey: 'S',
            tooltip: {
                children: translations.strikethrough
            }
        }
    );
};
