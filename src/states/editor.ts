import { TableOfContentDataItem } from '@tiptap-pro/extension-table-of-contents';
import { atom } from 'jotai';

export interface EditorState {
    navigation: {
        open: boolean;
        tableOfContents: TableOfContentDataItem[];
    };
    publish: boolean;
}

export const editorAtom = atom<EditorState>({
    navigation: {
        open: false,
        tableOfContents: []
    },
    publish: false
});
