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

export const editorDefaultExtensions: Extensions = [
    StarterKitExtension.configure({
        table: false,
        tableRow: false,
        tableCell: false,
        tableHeader: false,

        dropCursor: false,
        gapCursor: false
    }),

    Table.configure({
        resizable: true,
        cellMinWidth: 30
    }),
    TableRow,
    TableCell,
    TableHeader,

    Color,

    Dropcursor,
    Gapcursor,
    Placeholder.configure({
        placeholder: '',
        includeChildren: true
    })
];

export * from './margin';
export * from './padding';
