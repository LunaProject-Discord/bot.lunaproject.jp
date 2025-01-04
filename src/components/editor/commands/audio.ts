import { LocalizedEditorCommandFactory, LocalizedEditorRibbonButtonFactory } from '@/components/editor';
import { MusicNoteIcon } from '@/components/icons';
import { editorAtom } from '@/states/editor';
import { asRibbonButton } from '@lunaproject/web-editor';
import { useSetAtom } from 'jotai';

export const EditorInsertAudioCommand: LocalizedEditorCommandFactory = ({ translations }) => {
    const setEditorState = useSetAtom(editorAtom);

    return {
        name: 'insertAudio',
        icon: MusicNoteIcon,
        label: translations.audio,
        description: translations.web_page_editor_command_insert_audio_description,
        keywords: ['media', 'audio', 'sound', 'add', 'insert', 'メディア', '音声', '音源', '音楽', '楽曲', 'オーディオ', 'サウンド', '追加', '挿入'],
        perform: () => {
            setEditorState((prevState) => ({
                ...prevState,
                dialog: 'audio'
            }));
            return true;
        }
    };
};

export const EditorInsertAudioRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    EditorInsertAudioCommand(localization),
    {
        accessKey: 'A'
    }
);
