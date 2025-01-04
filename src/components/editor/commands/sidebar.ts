import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { DockToLeftFillIcon, DockToLeftIcon, DockToRightFillIcon, DockToRightIcon } from '@/components/icons';
import { editorAtom } from '@/states/editor';
import { asRibbonButton } from '@lunaproject/web-editor';
import { useAtom } from 'jotai';

export const EditorToggleNavigationSidebarCommand: LocalizedEditorCommandFactory = ({ translations }) => {
    const [{ navigation: { open } }, setEditorState] = useAtom(editorAtom);

    return {
        name: 'toggleNavigationSidebar',
        icon: open ? DockToRightFillIcon : DockToRightIcon,
        label: translations.web_page_editor_command_sidebar_navigation,
        description: translations.web_page_editor_command_sidebar_navigation_description,
        keywords: ['navigation', 'sidebar', 'navigationSidebar', 'toggle', 'show', 'hide', 'ナビゲーション', 'サイドバー', 'ナビゲーションサイドバー', '切り替え', '切替', 'トグル', '表示', '非表示'],
        selected: open,
        perform: () => {
            setEditorState((prevState) => ({
                ...prevState,
                navigation: {
                    ...prevState.navigation,
                    open: !prevState.navigation.open
                }
            }));
            return true;
        }
    };
};

export const EditorTogglePublishSidebarCommand: LocalizedEditorCommandFactory = ({ translations }) => {
    const [{ publish: open }, setEditorState] = useAtom(editorAtom);

    return {
        name: 'togglePublishSidebar',
        icon: open ? DockToLeftFillIcon : DockToLeftIcon,
        label: translations.web_page_editor_command_sidebar_publish,
        description: translations.web_page_editor_command_sidebar_publish_description,
        keywords: ['publish', 'sidebar', 'publishSidebar', 'toggle', 'show', 'hide', '公開', 'サイドバー', '公開サイドバー', '切り替え', '切替', 'トグル', '表示', '非表示'],
        selected: open,
        perform: () => {
            setEditorState((prevState) => ({
                ...prevState,
                publish: !prevState.publish
            }));
            return true;
        }
    };
};

export const EditorToggleNavigationSidebarRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorToggleNavigationSidebarCommand(localization),
    {
        accessKey: 'N'
    }
);

export const EditorTogglePublishSidebarRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorTogglePublishSidebarCommand(localization),
    {
        accessKey: 'P'
    }
);
