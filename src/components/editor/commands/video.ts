import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { MovieIcon } from '@/components/icons';
import { editorAtom } from '@/states/editor';
import { asRibbonButton } from '@lunaproject/web-editor';
import { useSetAtom } from 'jotai';

export const EditorInsertVideoCommand: LocalizedEditorCommandFactory = ({ translations }) => {
    const setEditorState = useSetAtom(editorAtom);

    return {
        name: 'insertVideo',
        icon: MovieIcon,
        label: translations.video,
        description: translations.web_page_editor_command_insert_video_description,
        keywords: ['media', 'video', 'movie', 'add', 'insert', 'メディア', '動画', '映像', 'ビデオ', 'ムービー', '追加', '挿入'],
        perform: () => {
            setEditorState((prevState) => ({
                ...prevState,
                dialog: 'video'
            }));
            return true;
        }
    };
};

export const EditorInsertVideoRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertVideoCommand(localization),
    {
        accessKey: 'V'
    }
);
