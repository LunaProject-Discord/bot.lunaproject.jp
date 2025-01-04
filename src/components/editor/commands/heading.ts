import {
    insertContentAfter,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatH1Icon, FormatH2Icon, FormatH3Icon } from '@/components/icons';
import { asRibbonButton } from '@lunaproject/web-editor';

export const EditorToggleHeadingLargeCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'toggleHeadingLarge',
    icon: FormatH1Icon,
    label: translations.heading_large,
    description: translations.web_page_editor_command_toggle_heading_large_description,
    keywords: ['heading', 'large', 'headingLarge', 'h1', 'toggle', 'change', 'update', '見出し', '大', '大見出し', '切り替え', '切替', 'トグル', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().toggleHeading({ level: 2 }),
    selected: ({ editor }) => editor.isActive('heading', { level: 2 }),
    perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run()
});

export const EditorToggleHeadingMediumCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'toggleHeadingMedium',
    icon: FormatH2Icon,
    label: translations.heading_medium,
    description: translations.web_page_editor_command_toggle_heading_medium_description,
    keywords: ['heading', 'medium', 'headingMedium', 'h2', 'toggle', 'change', 'update', '見出し', '中', '中見出し', '切り替え', '切替', 'トグル', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().toggleHeading({ level: 3 }),
    selected: ({ editor }) => editor.isActive('heading', { level: 3 }),
    perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 3 }).run()
});

export const EditorToggleHeadingSmallCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'toggleHeadingSmall',
    icon: FormatH3Icon,
    label: translations.heading_small,
    description: translations.web_page_editor_command_toggle_heading_small_description,
    keywords: ['heading', 'small', 'headingSmall', 'h3', 'toggle', 'change', 'update', '見出し', '小', '小見出し', '切り替え', '切替', 'トグル', '変更', '更新'],
    disabled: ({ editor }) => !editor.can().toggleHeading({ level: 4 }),
    selected: ({ editor }) => editor.isActive('heading', { level: 4 }),
    perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 4 }).run()
});

export const EditorInsertHeadingLargeCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertHeadingLarge',
    icon: FormatH1Icon,
    label: translations.heading_large,
    description: translations.web_page_editor_command_insert_heading_large_description,
    keywords: ['heading', 'large', 'headingLarge', 'h1', 'add', 'insert', '見出し', '大', '大見出し', '追加', '挿入'],
    perform: insertContentAfter({ type: 'heading', level: 2 })
});

export const EditorInsertHeadingMediumCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertHeadingMedium',
    icon: FormatH2Icon,
    label: translations.heading_medium,
    description: translations.web_page_editor_command_insert_heading_medium_description,
    keywords: ['heading', 'medium', 'headingMedium', 'h2', 'add', 'insert', '見出し', '中', '中見出し', '追加', '挿入'],
    perform: insertContentAfter({ type: 'heading', level: 3 })
});

export const EditorInsertHeadingSmallCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertHeadingSmall',
    icon: FormatH3Icon,
    label: translations.heading_small,
    description: translations.web_page_editor_command_insert_heading_small_description,
    keywords: ['heading', 'small', 'headingSmall', 'h3', 'add', 'insert', '見出し', '小', '小見出し', '追加', '挿入'],
    perform: insertContentAfter({ type: 'heading', level: 4 })
});

export const EditorToggleHeadingLargeRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorToggleHeadingLargeCommand(localization),
        {
            label: undefined,
            accessKey: '1',
            tooltip: {
                children: translations.heading_large
            }
        }
    );
};

export const EditorToggleHeadingMediumRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorToggleHeadingMediumCommand(localization),
        {
            label: undefined,
            accessKey: '2',
            tooltip: {
                children: translations.heading_medium
            }
        }
    );
};

export const EditorToggleHeadingSmallRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorToggleHeadingSmallCommand(localization),
        {
            label: undefined,
            accessKey: '3',
            tooltip: {
                children: translations.heading_small
            }
        }
    );
};

export const EditorInsertHeadingLargeRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertHeadingLargeCommand(localization),
    {
        accessKey: '1'
    }
);

export const EditorInsertHeadingMediumRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertHeadingMediumCommand(localization),
    {
        accessKey: '2'
    }
);

export const EditorInsertHeadingSmallRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertHeadingSmallCommand(localization),
    {
        accessKey: '3'
    }
);
