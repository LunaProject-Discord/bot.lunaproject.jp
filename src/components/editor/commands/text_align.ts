import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import {
    FormatAlignCenterIcon,
    FormatAlignJustifyIcon,
    FormatAlignLeftIcon,
    FormatAlignRightIcon
} from '@/components/icons';
import {
    asRibbonButton,
    TextAlignCenterCommand,
    TextAlignJustifyCommand,
    TextAlignLeftCommand,
    TextAlignRightCommand
} from '@lunaproject/web-editor';

export const EditorTextAlignLeftCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TextAlignLeftCommand,
    {
        icon: FormatAlignLeftIcon,
        label: translations.align_left,
        description: translations.web_page_editor_command_align_left_description
    }
);

export const EditorTextAlignCenterCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TextAlignCenterCommand,
    {
        icon: FormatAlignCenterIcon,
        label: translations.align_center,
        description: translations.web_page_editor_command_align_center_description
    }
);

export const EditorTextAlignRightCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TextAlignRightCommand,
    {
        icon: FormatAlignRightIcon,
        label: translations.align_right,
        description: translations.web_page_editor_command_align_right_description
    }
);

export const EditorTextAlignJustifyCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TextAlignJustifyCommand,
    {
        icon: FormatAlignJustifyIcon,
        label: translations.align_justify,
        description: translations.web_page_editor_command_align_justify_description
    }
);

export const EditorTextAlignLeftRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorTextAlignLeftCommand(localization),
        {
            label: undefined,
            accessKey: 'AL',
            tooltip: {
                children: translations.align_left
            }
        }
    );
};

export const EditorTextAlignCenterRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorTextAlignCenterCommand(localization),
        {
            label: undefined,
            accessKey: 'AC',
            tooltip: {
                children: translations.align_center
            }
        }
    );
};

export const EditorTextAlignRightRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorTextAlignRightCommand(localization),
        {
            label: undefined,
            accessKey: 'AR',
            tooltip: {
                children: translations.align_right
            }
        }
    );
};

export const EditorTextAlignJustifyRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorTextAlignJustifyCommand(localization),
        {
            label: undefined,
            accessKey: 'AJ',
            tooltip: {
                children: translations.align_justify
            }
        }
    );
};
