'use client';

import { EditorHeaderRoot } from '@/components/editor';
import { RedoIcon, SaveIcon, UndoIcon } from '@/components/icons';
import { MessageEditorRibbonTabs, serialize } from '@/components/message_v2';
import { LocalizationProps } from '@/interfaces/localization';
import {
    RibbonDivider,
    RibbonGroupRoot,
    RibbonProvider,
    RibbonTabContext,
    RibbonTabHeader,
    RibbonTabPanel,
    RibbonTabs
} from '@lunaproject/web-editor';
import { Box, Collapse, IconButton, Tooltip } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import React from 'react';

export const MessageEditorHeader = ({ localization }: LocalizationProps) => {
    const { translations } = localization;

    const { editor } = useCurrentEditor();
    if (!editor)
        return null;

    return (
        <RibbonProvider editor={editor} tabs={MessageEditorRibbonTabs(localization)}>
            <EditorHeaderRoot>
                <RibbonTabHeader>
                    <RibbonGroupRoot>
                        <Tooltip title={translations.save} placement="bottom">
                            <IconButton
                                onClick={() => {
                                    if (!editor || !editor.isInitialized || editor.isDestroyed)
                                        return;

                                    const messageNodePos = editor.$doc.querySelector('message');
                                    if (!messageNodePos)
                                        return;

                                    console.log(serialize(messageNodePos));
                                }}
                                disabled={!editor.isInitialized || editor.isDestroyed}
                            >
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.undo} placement="bottom">
                            <IconButton
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.isInitialized || editor.isDestroyed || !editor.can().undo()}
                            >
                                <UndoIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.redo} placement="bottom">
                            <IconButton
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.isInitialized || editor.isDestroyed || !editor.can().redo()}
                            >
                                <RedoIcon />
                            </IconButton>
                        </Tooltip>
                    </RibbonGroupRoot>
                    <RibbonDivider sx={{ my: 2, mr: 1 }} />
                    <RibbonTabs editor={editor} />
                </RibbonTabHeader>
                <RibbonTabContext.Consumer>
                    {({ open }) => (
                        <Collapse in={open}>
                            <Box sx={{ minHeight: (theme) => theme.spacing(6) }}>
                                <RibbonTabPanel editor={editor} />
                            </Box>
                        </Collapse>
                    )}
                </RibbonTabContext.Consumer>
            </EditorHeaderRoot>
        </RibbonProvider>
    );
};
