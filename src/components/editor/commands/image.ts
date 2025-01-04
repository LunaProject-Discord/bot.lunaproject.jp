import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { ImageIcon } from '@/components/icons';
import { editorAtom } from '@/states/editor';
import { asRibbonButton } from '@lunaproject/web-editor';
import { useSetAtom } from 'jotai';

export const EditorInsertImageCommand: LocalizedEditorCommandFactory = ({ translations }) => {
    const setEditorState = useSetAtom(editorAtom);

    return {
        name: 'insertImage',
        icon: ImageIcon,
        label: translations.image,
        description: translations.web_page_editor_command_insert_image_description,
        keywords: ['media', 'image', 'picture', 'add', 'insert', 'メディア', '画像', '写真', 'イメージ', 'ピクチャー', 'ピクチャ', '追加', '挿入'],
        perform: () => {
            setEditorState((prevState) => ({
                ...prevState,
                dialog: 'image'
            }));
            return true;
        }
    };
};

export const EditorInsertImageRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertImageCommand(localization),
    {
        accessKey: 'I'
    }
);
