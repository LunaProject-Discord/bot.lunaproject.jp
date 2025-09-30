import {
    asEditorCommand,
    insertContentAfter,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { FormatListBulletedIcon } from '@/components/icons';
import { asRibbonButton, BulletListCommand } from '@lunaproject/web-editor';

export const EditorToggleBulletListCommand: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    BulletListCommand,
    {
        name: 'toggleBulletList',
        icon: FormatListBulletedIcon,
        label: translations.bullet_list,
        description: translations.web_page_editor_command_toggle_bullet_list_description,
        disabled: false
    }
);

export const EditorInsertBulletListCommand: LocalizedEditorCommandFactory = ({ translations }) => ({
    name: 'insertBulletList',
    icon: FormatListBulletedIcon,
    label: translations.bullet_list,
    description: translations.web_page_editor_command_insert_bullet_list_description,
    keywords: ['bullet', 'list', 'bulletList', 'add', 'insert', '箇条書き', 'リスト', '箇条書きリスト', '追加', '挿入'],
    perform: insertContentAfter({ type: 'bulletList' })
});

export const EditorToggleBulletListRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        EditorToggleBulletListCommand(localization),
        {
            label: undefined,
            accessKey: 'LU',
            tooltip: {
                children: translations.bullet_list
            }
        }
    );
};

export const EditorInsertBulletListRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertBulletListCommand(localization),
    {
        accessKey: 'U'
    }
);
