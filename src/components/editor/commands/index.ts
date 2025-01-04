import { Localization } from '@/interfaces/localization';
import { EditorAction, EditorCommand, EditorRibbonButton, EditorRibbonDropdownButton } from '@lunaproject/web-editor';
import deepmerge from 'deepmerge';
import { BundledLanguage } from 'shiki/bundle/full';

export const asEditorCommand = (x: EditorCommand, y: Partial<EditorCommand>): EditorCommand => deepmerge<EditorCommand>(x, y);

export type LocalizedEditorCommandFactory = (localization: Localization) => EditorCommand;

export type LocalizedEditorRibbonButtonFactory = (localization: Localization) => EditorRibbonButton;

export type LocalizedEditorRibbonDropdownButtonFactory = (localization: Localization) => EditorRibbonDropdownButton;

export type InsertContentNode = { type: 'paragraph' }
    | { type: 'heading'; level: 2 | 3 | 4; }
    | { type: 'bulletList' }
    | { type: 'orderedList' }
    | { type: 'taskList' }
    | { type: 'table' }
    | { type: 'codeBlock'; content: string; language: BundledLanguage; }
    | { type: 'image'; src: string; alt?: string; caption?: string; }
    | { type: 'video'; src: string; controls?: boolean; loop?: boolean; muted?: boolean; caption?: string; }
    | { type: 'audio'; src: string; controls?: boolean; loop?: boolean; muted?: boolean; caption?: string; };

export const insertContentAfter: (node: InsertContentNode) => EditorAction = (node) => ({ editor, state }) => {
    const currentChain = editor.chain().focus();

    const currentNodePos = editor.$pos(state.selection.from);
    const currentNode = currentNodePos.node;

    if (currentNode.type.name !== 'paragraph' || currentNode.textContent.length > 0)
        currentChain.selectTextblockEnd();
    if (editor.isActive('image') || editor.isActive('video') || editor.isActive('audio'))
        currentChain.createParagraphNear();

    switch (node.type) {
        case 'paragraph':
        case 'heading':
            currentChain.insertContent(node);
            break;

        case 'bulletList':
        case 'orderedList':
            currentChain.insertContent(
                {
                    type: node.type,
                    content: [
                        {
                            type: 'listItem',
                            content: [
                                { type: 'paragraph' }
                            ]
                        }
                    ]
                }
            );
            break;

        case 'taskList':
            currentChain.insertContent(
                {
                    type: 'taskList',
                    content: [
                        {
                            type: 'taskItem',
                            content: [
                                { type: 'paragraph' }
                            ]
                        }
                    ]
                }
            );
            break;

        case 'table':
            currentChain.insertTable({ withHeaderRow: false });
            break;

        case 'codeBlock':
            currentChain.insertContent(
                {
                    type: node.type,
                    attrs: {
                        language: node.language
                    },
                    content: [
                        {
                            type: 'text',
                            text: node.content
                        }
                    ]
                }
            );
            break;

        case 'image':
            currentChain.insertContent(
                {
                    type: node.type,
                    attrs: {
                        src: node.src,
                        alt: node.alt || undefined
                    },
                    content: node.caption ? [
                        {
                            type: 'text',
                            text: node.caption
                        }
                    ] : []
                }
            );
            break;

        case 'video':
        case 'audio':
            currentChain.insertContent(
                {
                    type: node.type,
                    attrs: {
                        src: node.src,
                        controls: node.controls,
                        loop: node.loop,
                        muted: node.muted
                    },
                    content: node.caption ? [
                        {
                            type: 'text',
                            text: node.caption
                        }
                    ] : []
                }
            );
            break;

        default:
            break;
    }

    return currentChain.run();
};

export * from './audio';
export * from './bold';
export * from './bullet_list';
export * from './code';
export * from './heading';
export * from './image';
export * from './italic';
export * from './ordered_list';
export * from './paragraph';
export * from './sidebar';
export * from './strike';
export * from './subscript';
export * from './superscript';
export * from './table';
export * from './task_list';
export * from './text_align';
export * from './underline';
export * from './video';
