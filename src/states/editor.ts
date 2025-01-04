import { GuildWebPageContent } from '@/interfaces/bot';
import { TableOfContentDataItem } from '@tiptap-pro/extension-table-of-contents';
import { atom } from 'jotai';

export type EditorSaveStateType = 'success' | 'error' | 'loading';

export interface EditorSaveStateRoot {
    type: EditorSaveStateType;
}

export interface EditorSaveStateSuccess extends EditorSaveStateRoot {
    type: 'success';
    data: GuildWebPageContent;
}

export interface EditorSaveStateError extends EditorSaveStateRoot {
    type: 'error';
    message?: string;
}

export interface EditorSaveStateLoading extends EditorSaveStateRoot {
    type: 'loading';
}

export type EditorSaveState =
    EditorSaveStateSuccess
    | EditorSaveStateError
    | EditorSaveStateLoading
    | undefined;

export type EditorDialogState = 'image' | 'video' | 'audio' | undefined;

export interface EditorState {
    save: EditorSaveState;
    dialog: EditorDialogState;
    navigation: {
        open: boolean;
        tableOfContents: TableOfContentDataItem[];
    };
    publish: boolean;
}

export const editorAtom = atom<EditorState>({
    save: undefined,
    dialog: undefined,
    navigation: {
        open: false,
        tableOfContents: []
    },
    publish: false
});
