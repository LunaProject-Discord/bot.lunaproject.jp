import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { SubscriptIcon } from '@/components/icons';
import { asRibbonButton, SubscriptCommand } from '@lunaproject/web-editor';

export const EditorSubscriptCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    SubscriptCommand,
    {
        icon: SubscriptIcon,
        label: translations.subscript,
        description: translations.web_page_editor_command_subscript_description
    }
);

export const EditorSubscriptRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorSubscriptCommand(localization),
        {
            label: undefined,
            accessKey: 'VB',
            tooltip: {
                children: translations.subscript
            }
        }
    );
};
