import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory,
    LocalizedEditorRibbonDropdownButtonFactory
} from '@/components/editor';
import {
    AddColumnLeftIcon,
    AddColumnRightIcon,
    AddIcon,
    AddRowAboveIcon,
    AddRowBelowIcon,
    CalendarViewDayFillIcon,
    CallMergeIcon,
    CallSplitIcon,
    CloseIcon,
    ColumnDeleteIcon,
    RowDeleteIcon,
    SplitscreenLeftIcon,
    SplitscreenTopIcon,
    TableIcon
} from '@/components/icons';
import {
    asRibbonButton,
    asRibbonDropdownButtonOption,
    TableAddColumnAfterCommand,
    TableAddColumnBeforeCommand,
    TableAddRowAfterCommand,
    TableAddRowBeforeCommand,
    TableDeleteColumnCommand,
    TableDeleteRowCommand,
    TableMergeCellsCommand,
    TableSplitCellCommand,
    TableToggleHeaderCellCommand,
    TableToggleHeaderColumnCommand,
    TableToggleHeaderRowCommand
} from '@lunaproject/web-editor';

export const EditorInsertTableCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertTable',
    icon: TableIcon,
    label: translations.table,
    description: translations.web_page_editor_command_insert_table_description,
    keywords: ['table', 'add', 'insert', '表', 'テーブル', '追加', '挿入'],
    perform: ({ editor }) => editor.chain().focus().insertTable().run()
});

export const EditorDeleteTableCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'deleteTable',
    icon: CloseIcon,
    label: translations.web_page_editor_command_delete_table,
    description: translations.web_page_editor_command_delete_table_description,
    keywords: ['table', 'delete', 'remove', '表', 'テーブル', '削除', '消去'],
    disabled: ({ editor }) => !editor.can().deleteTable(),
    perform: ({ editor }) => editor.chain().focus().deleteTable().run()
});

export const EditorTableAddRowBeforeCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableAddRowBeforeCommand,
    {
        icon: AddRowAboveIcon,
        label: translations.web_page_editor_command_table_add_row_before,
        description: translations.web_page_editor_command_table_add_row_before_description
    }
);

export const EditorTableAddRowAfterCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableAddRowAfterCommand,
    {
        icon: AddRowBelowIcon,
        label: translations.web_page_editor_command_table_add_row_after,
        description: translations.web_page_editor_command_table_add_row_after_description
    }
);

export const EditorTableDeleteRowCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableDeleteRowCommand,
    {
        icon: RowDeleteIcon,
        label: translations.web_page_editor_command_table_delete_row,
        description: translations.web_page_editor_command_table_delete_row_description
    }
);

export const EditorTableAddColumnBeforeCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableAddColumnBeforeCommand,
    {
        icon: AddColumnLeftIcon,
        label: translations.web_page_editor_command_table_add_column_before,
        description: translations.web_page_editor_command_table_add_column_before_description
    }
);

export const EditorTableAddColumnAfterCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableAddColumnAfterCommand,
    {
        icon: AddColumnRightIcon,
        label: translations.web_page_editor_command_table_add_column_after,
        description: translations.web_page_editor_command_table_add_column_after_description
    }
);

export const EditorTableDeleteColumnCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableDeleteColumnCommand,
    {
        icon: ColumnDeleteIcon,
        label: translations.web_page_editor_command_table_delete_column,
        description: translations.web_page_editor_command_table_delete_column_description
    }
);

export const EditorTableMergeCellsCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableMergeCellsCommand,
    {
        icon: CallMergeIcon,
        label: translations.web_page_editor_command_table_merge_cells,
        description: translations.web_page_editor_command_table_merge_cells_description
    }
);

export const EditorTableSplitCellCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableSplitCellCommand,
    {
        icon: CallSplitIcon,
        label: translations.web_page_editor_command_table_split_cell,
        description: translations.web_page_editor_command_table_split_cell_description
    }
);

export const EditorTableToggleHeaderRowCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableToggleHeaderRowCommand,
    {
        icon: SplitscreenTopIcon,
        label: translations.web_page_editor_command_table_toggle_header_row,
        description: translations.web_page_editor_command_table_toggle_header_row_description
    }
);

export const EditorTableToggleHeaderColumnCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableToggleHeaderColumnCommand,
    {
        icon: SplitscreenLeftIcon,
        label: translations.web_page_editor_command_table_toggle_header_column,
        description: translations.web_page_editor_command_table_toggle_header_column_description
    }
);

export const EditorTableToggleHeaderCellCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TableToggleHeaderCellCommand,
    {
        icon: CalendarViewDayFillIcon,
        label: translations.web_page_editor_command_table_toggle_header_cell,
        description: translations.web_page_editor_command_table_toggle_header_cell_description
    }
);

export const EditorInsertTableRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertTableCommand(localization),
    {
        accessKey: 'T'
    }
);

export const EditorTableDeleteRibbonDropdownButton: LocalizedEditorRibbonDropdownButtonFactory = (localization) => {
    const { translations } = localization;

    return {
        type: 'ribbonDropdownButton',
        name: 'tableDelete',
        icon: CloseIcon,
        label: translations.delete,
        accessKey: 'D',
        options: [
            asRibbonDropdownButtonOption(
                EditorTableDeleteRowCommand(localization),
                {
                    description: undefined,
                    accessKey: 'R'
                }
            ),
            asRibbonDropdownButtonOption(
                EditorTableDeleteColumnCommand(localization),
                {
                    description: undefined,
                    accessKey: 'C'
                }
            ),
            { type: 'divider' },
            asRibbonDropdownButtonOption(
                EditorDeleteTableCommand(localization),
                {
                    description: undefined,
                    accessKey: 'T'
                }
            )
        ]
    };
};

export const EditorTableAddRowRibbonDropdownButton: LocalizedEditorRibbonDropdownButtonFactory = (localization) => {
    const { translations } = localization;

    return {
        type: 'ribbonDropdownButton',
        name: 'tableAddRow',
        icon: AddIcon,
        label: translations.web_page_editor_command_table_add_row,
        accessKey: 'R',
        options: [
            asRibbonDropdownButtonOption(
                EditorTableAddRowBeforeCommand(localization),
                {
                    description: undefined,
                    accessKey: 'U'
                }
            ),
            asRibbonDropdownButtonOption(
                EditorTableAddRowAfterCommand(localization),
                {
                    description: undefined,
                    accessKey: 'D'
                }
            )
        ]
    };
};

export const EditorTableAddColumnRibbonDropdownButton: LocalizedEditorRibbonDropdownButtonFactory = (localization) => {
    const { translations } = localization;

    return {
        type: 'ribbonDropdownButton',
        name: 'tableAddColumn',
        icon: AddIcon,
        label: translations.web_page_editor_command_table_add_column,
        accessKey: 'C',
        options: [
            asRibbonDropdownButtonOption(
                EditorTableAddColumnBeforeCommand(localization),
                {
                    description: undefined,
                    accessKey: 'L'
                }
            ),
            asRibbonDropdownButtonOption(
                EditorTableAddColumnAfterCommand(localization),
                {
                    description: undefined,
                    accessKey: 'R'
                }
            )
        ]
    };
};

export const EditorTableMergeCellsRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorTableMergeCellsCommand(localization),
    {
        accessKey: 'M'
    }
);

export const EditorTableSplitCellRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorTableSplitCellCommand(localization),
    {
        accessKey: 'S'
    }
);

export const EditorTableToggleHeaderRowRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorTableToggleHeaderRowCommand(localization),
    {
        accessKey: 'HR'
    }
);

export const EditorTableToggleHeaderColumnRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorTableToggleHeaderColumnCommand(localization),
    {
        accessKey: 'HC'
    }
);

export const EditorTableToggleHeaderCellRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorTableToggleHeaderCellCommand(localization),
        {
            label: undefined,
            accessKey: 'HE',
            tooltip: {
                children: translations.web_page_editor_command_table_toggle_header_cell
            }
        }
    );
};
