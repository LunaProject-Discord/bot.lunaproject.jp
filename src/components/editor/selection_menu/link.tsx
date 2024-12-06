'use client';

import { EditorSelectionMenuButton, EditorSelectionMenuIconButton, EditorSelectionMenuRoot } from '@/components/editor';
import { CheckIcon, CloseIcon, EditIcon, LinkOffIcon, OpenInNewIcon } from '@/components/icons';
import { InputBase, inputBaseClasses, Tooltip } from '@mui/material';
import { BubbleMenu, EditorEvents, useCurrentEditor } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

export const EditorLinkSelectionMenu = () => {
    const [currentHref, setCurrentHref] = useState('');

    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const { editor } = useCurrentEditor();

    const handleOpenLinkButtonClick = () => {
        if (!editor)
            return;

        const href: string = editor.getAttributes('link').href;
        window.open(href, '_blank');
    };

    const handleSetLinkButtonClick = () => {
        if (!editor)
            return;

        const result = z.string().url().safeParse(inputValue);
        if (!result.success)
            return;

        editor.chain().focus().setLink({ href: result.data }).run();
        setEditing(false);
    };

    const handleUnsetLinkButtonClick = () => {
        if (!editor)
            return;

        editor.chain().focus().unsetLink().run();
    };

    useEffect(() => {
        if (!editor)
            return;

        const handleEditorSelectionUpdate = ({ editor }: EditorEvents['selectionUpdate']) => {
            const href: string = editor.getAttributes('link').href;
            if (href === currentHref)
                return;

            setEditing(false);
            setCurrentHref(href);
            setInputValue(href);
        };

        editor.on('selectionUpdate', handleEditorSelectionUpdate);
        return () => {
            editor.off('selectionUpdate', handleEditorSelectionUpdate);
        };
    }, [currentHref, editor]);

    if (!editor)
        return null;

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={({ editor, state }) => state.selection.empty && editor.isActive('link')}
        >
            {editing ? <EditorSelectionMenuRoot>
                <InputBase
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="URL を入力..."
                    sx={{
                        p: .5,
                        borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                        [`& .${inputBaseClasses.input}`]: {
                            p: 0,
                            fontFamily: 'HackGen, Consolas, monospace'
                        }
                    }}
                />
                <Tooltip title="キャンセル">
                    <EditorSelectionMenuIconButton onClick={() => setEditing(false)}>
                        <CloseIcon fontSize="small" />
                    </EditorSelectionMenuIconButton>
                </Tooltip>
                <EditorSelectionMenuButton
                    onClick={handleSetLinkButtonClick}
                    disableElevation
                    variant="contained"
                    startIcon={<CheckIcon />}
                >
                    保存
                </EditorSelectionMenuButton>
            </EditorSelectionMenuRoot> : <EditorSelectionMenuRoot>
                <EditorSelectionMenuButton
                    onClick={handleOpenLinkButtonClick}
                    disableElevation
                    variant="contained"
                    startIcon={<OpenInNewIcon />}
                >
                    リンクを開く
                </EditorSelectionMenuButton>
                <Tooltip title="リンクを編集">
                    <EditorSelectionMenuIconButton onClick={() => setEditing(true)}>
                        <EditIcon fontSize="small" />
                    </EditorSelectionMenuIconButton>
                </Tooltip>
                <Tooltip title="リンクを解除">
                    <EditorSelectionMenuIconButton onClick={handleUnsetLinkButtonClick}>
                        <LinkOffIcon fontSize="small" />
                    </EditorSelectionMenuIconButton>
                </Tooltip>
            </EditorSelectionMenuRoot>}
        </BubbleMenu>
    );
};
