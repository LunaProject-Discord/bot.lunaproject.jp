import {
    asEditorCommand,
    insertContentAfter,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { ChecklistIcon } from '@/components/icons';
import { asRibbonButton, TaskListCommand } from '@lunaproject/web-editor';

export const EditorToggleTaskListCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    TaskListCommand,
    {
        name: 'toggleTaskList',
        icon: ChecklistIcon,
        label: translations.task_list,
        description: translations.web_page_editor_command_toggle_task_list_description
    }
);

export const EditorInsertTaskListCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertTaskList',
    icon: ChecklistIcon,
    label: translations.task_list,
    description: translations.web_page_editor_command_insert_task_list_description,
    keywords: ['check', 'list', 'checkList', 'task', 'taskList', 'todo', 'todoList', 'add', 'insert', 'チェック', 'リスト', 'チェックリスト', 'タスク', 'タスクリスト', 'ToDoリスト', '追加', '挿入'],
    perform: insertContentAfter({ type: 'taskList' })
});

export const EditorToggleTaskListRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorToggleTaskListCommand(localization),
        {
            label: undefined,
            accessKey: 'LC',
            tooltip: {
                children: translations.task_list
            }
        }
    );
};

export const EditorInsertTaskListRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorInsertTaskListCommand(localization),
        {
            label: undefined,
            accessKey: 'C',
            tooltip: {
                children: translations.task_list
            }
        }
    );
};
