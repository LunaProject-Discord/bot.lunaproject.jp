'use client';

import { EditorHeaderRoot } from '@/components/editor';
import { CloseIcon, RedoIcon, SaveIcon, UndoIcon } from '@/components/icons';
import { MessageBuilderMenuProps } from '@/components/message_v2';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import {
    RibbonDivider,
    RibbonGroupRoot,
    RibbonTabContext,
    RibbonTabHeader,
    RibbonTabPanel,
    RibbonTabs
} from '@lunaproject/web-editor';
import { Box, Collapse, IconButton, Tooltip } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import React from 'react';

export const MessageBuilderDesktopMenu = (
    {
        onSaveButtonClick,
        onCancelButtonClick,
        localization
    }: MessageBuilderMenuProps
) => {
    const { translations } = localization;

    const { editor } = useCurrentEditor();
    if (!editor)
        return null;

    return (
        <EditorHeaderRoot>
            <RibbonTabHeader>
                <RibbonGroupRoot>
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
                <Box
                    sx={{
                        ml: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Button
                        onClick={onCancelButtonClick}
                        variant="outlined"
                        corners="extended"
                        startIcon={<CloseIcon />}
                    >
                        {translations.cancel}
                    </Button>
                    <Button
                        onClick={onSaveButtonClick}
                        disableElevation
                        variant="contained"
                        corners="extended"
                        startIcon={<SaveIcon />}
                    >
                        {translations.save}
                    </Button>
                </Box>
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
    );
};
