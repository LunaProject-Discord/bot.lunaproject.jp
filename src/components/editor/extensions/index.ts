import { Audio, Image, TaskItem, Video } from '@/components/editor';
import { StarterKitExtension } from '@lunaproject/web-editor';
import { Extensions } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki';

export const editorDefaultExtensions: Extensions = [
    StarterKitExtension.configure({
        taskItem: false,
        table: false,
        tableRow: false,
        tableCell: false,
        tableHeader: false,
        image: false,

        dropCursor: false,
        gapCursor: false
    }),

    TaskItem,
    Table.configure({
        resizable: true,
        cellMinWidth: 30
    }),
    TableRow,
    TableCell,
    TableHeader,
    CodeBlockShiki.configure({
        defaultTheme: 'github-dark-default'
    }),
    Image,
    Video,
    Audio,

    Color,

    Dropcursor,
    Gapcursor,
    Placeholder.configure({
        placeholder: '',
        includeChildren: true
    })
];

export * from './audio';
export * from './image';
export * from './margin';
export * from './padding';
export * from './task_item';
export * from './video';
