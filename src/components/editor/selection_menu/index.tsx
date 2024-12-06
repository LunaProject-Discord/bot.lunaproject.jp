'use client';

import {
    CheckIcon,
    CloseIcon,
    CodeIcon,
    FormatBoldIcon,
    FormatItalicIcon,
    FormatStrikethroughIcon,
    FormatUnderlinedIcon,
    LinkIcon
} from '@/components/icons';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { ButtonBase } from '@lunaproject/web-core/dist/components/ButtonBase';
import { borderAndBoxShadow, generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import {
    Box,
    BoxProps,
    ButtonBaseProps,
    buttonClasses,
    ButtonProps,
    Divider,
    InputBase,
    inputBaseClasses,
    styled,
    ToggleButton,
    ToggleButtonProps,
    Tooltip
} from '@mui/material';
import { BubbleMenu, useCurrentEditor } from '@tiptap/react';
import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';
import { z } from 'zod';

export const editorSelectionMenuClasses = generateComponentClasses(
    'EditorSelectionMenu',
    [
        'root',
        'button',
        'iconButton',
        'toggleButton'
    ]
);

export const EditorSelectionMenuRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(editorSelectionMenuClasses.root, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    padding: theme.spacing(.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5),
    backgroundColor: theme.vars.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    ...borderAndBoxShadow(theme)
}));

export const EditorSelectionMenuButton = styled(
    // eslint-disable-next-line react/display-name
    forwardRef<HTMLButtonElement, ButtonProps>(({ size, className, ...props }, ref) => (
        <Button
            ref={ref}
            size={size || 'small'}
            className={clsx(editorSelectionMenuClasses.button, className)}
            {...props}
        />
    ))
)(({ theme }) => ({
    height: theme.spacing(4),
    [`&.${buttonClasses.outlined}, &.${buttonClasses.text}`]: {
        color: theme.vars.palette.action.active
    }
}));

export const EditorSelectionMenuIconButton = styled(
    // eslint-disable-next-line react/display-name
    forwardRef<HTMLButtonElement, ButtonBaseProps>(({ className, ...props }, ref) => (
        <ButtonBase
            ref={ref}
            className={clsx(editorSelectionMenuClasses.iconButton, className)}
            {...props}
        />
    ))
)(({ theme }) => ({
    width: theme.spacing(4),
    aspectRatio: '1',
    padding: theme.spacing(.5),
    color: theme.vars.palette.action.active,
    borderRadius: theme.shape.borderRadius
}));

export const EditorSelectionMenuToggleButton = styled(
    // eslint-disable-next-line react/display-name
    forwardRef<HTMLButtonElement, ToggleButtonProps>(({ size, className, ...props }, ref) => (
        <ToggleButton
            ref={ref}
            size={size || 'small'}
            className={clsx(editorSelectionMenuClasses.toggleButton, className)}
            {...props}
        />
    ))
)(({ theme }) => ({
    width: theme.spacing(4),
    aspectRatio: '1',
    padding: theme.spacing(.5),
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    }),
    border: 'none'
}));

export const EditorSelectionMenu = () => {
    const [linkEditing, setLinkEditing] = useState(false);
    const [hrefInputValue, setHrefInputValue] = useState('');

    const { editor } = useCurrentEditor();

    const handleStartLinkEditButtonClick = () => {
        if (!editor)
            return;

        if (editor.isActive('link')) {
            editor.chain().focus().setTextSelection(editor.view.state.selection.from).run();
            return;
        }

        setLinkEditing(true);
    };

    const handleSetLinkButtonClick = () => {
        if (!editor)
            return;

        const result = z.string().url().safeParse(hrefInputValue);
        if (!result.success)
            return;

        editor.chain().focus().setLink({ href: result.data }).run();
        setLinkEditing(false);
    };

    if (!editor)
        return null;

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={({ editor, state }) => !state.selection.empty && !editor.isActive('image')}
        >
            {linkEditing ? <EditorSelectionMenuRoot>
                <InputBase
                    value={hrefInputValue}
                    onChange={(e) => setHrefInputValue(e.target.value)}
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
                    <EditorSelectionMenuIconButton onClick={() => setLinkEditing(false)}>
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
                    onClick={handleStartLinkEditButtonClick}
                    startIcon={<LinkIcon />}
                >
                    リンク
                </EditorSelectionMenuButton>
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mx: .5, my: 1 }}
                />
                <Tooltip title="太字">
                    <EditorSelectionMenuToggleButton
                        value="bold"
                        selected={editor.isActive('bold')}
                        onChange={() => editor.chain().focus().toggleBold().run()}
                    >
                        <FormatBoldIcon fontSize="small" />
                    </EditorSelectionMenuToggleButton>
                </Tooltip>
                <Tooltip title="斜体">
                    <EditorSelectionMenuToggleButton
                        value="italic"
                        selected={editor.isActive('italic')}
                        onChange={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <FormatItalicIcon fontSize="small" />
                    </EditorSelectionMenuToggleButton>
                </Tooltip>
                <Tooltip title="下線">
                    <EditorSelectionMenuToggleButton
                        value="underline"
                        selected={editor.isActive('underline')}
                        onChange={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <FormatUnderlinedIcon fontSize="small" />
                    </EditorSelectionMenuToggleButton>
                </Tooltip>
                <Tooltip title="取り消し線">
                    <EditorSelectionMenuToggleButton
                        value="strikethrough"
                        selected={editor.isActive('strike')}
                        onChange={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <FormatStrikethroughIcon fontSize="small" />
                    </EditorSelectionMenuToggleButton>
                </Tooltip>
                <Tooltip title="コード">
                    <EditorSelectionMenuToggleButton
                        value="code"
                        selected={editor.isActive('code')}
                        onChange={() => editor.chain().focus().toggleCode().run()}
                    >
                        <CodeIcon fontSize="small" />
                    </EditorSelectionMenuToggleButton>
                </Tooltip>
            </EditorSelectionMenuRoot>}
        </BubbleMenu>
    );
};

export * from './link';
