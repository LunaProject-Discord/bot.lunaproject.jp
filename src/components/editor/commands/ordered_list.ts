import {
    asEditorCommand,
    insertContentAfter,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatListNumberedIcon } from '@/components/icons';
import { asRibbonButton, OrderedListCommand } from '@lunaproject/web-editor';

export const EditorToggleOrderedListCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    OrderedListCommand,
    {
        name: 'toggleOrderedList',
        icon: FormatListNumberedIcon,
        label: translations.ordered_list,
        description: translations.web_page_editor_command_toggle_numbered_list_description
    }
);

export const EditorInsertOrderedListCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertOrderedList',
    icon: FormatListNumberedIcon,
    label: translations.ordered_list,
    description: translations.web_page_editor_command_insert_numbered_list_description,
    keywords: ['ordered', 'list', 'orderedList', 'add', 'insert', '番号付きリスト', 'リスト', '番号付きリスト', '追加', '挿入'],
    perform: insertContentAfter({ type: 'orderedList' })
});

export const EditorToggleOrderedListRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorToggleOrderedListCommand(localization),
        {
            label: undefined,
            accessKey: 'LO',
            tooltip: {
                children: translations.ordered_list
            }
        }
    );
};

export const EditorInsertOrderedListRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertOrderedListCommand(localization),
    {
        accessKey: 'O'
    }
);
