'use client';

import { EditorSidebarProps } from '@/components/editor';
import { CloseIcon } from '@/components/icons';
import { editorAtom } from '@/states/editor';
import { NAVIGATION_DRAWER_WIDTH } from '@lunaproject/web-core/dist/components/Navigation';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { Box, Divider, Drawer, drawerClasses, IconButton, Tooltip, Typography } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import React from 'react';

export const editorPublishSidebarClasses = generateComponentClasses(
    'EditorPublishSidebar',
    [
        'root'
    ]
);

export const EditorPublishSidebar = ({ localization: { translations } }: EditorSidebarProps) => {
    const [{ publish: open }, setEditorState] = useAtom(editorAtom);

    const { editor } = useCurrentEditor();

    const handleCloseButtonClick = () => setEditorState((prevState) => ({
        ...prevState,
        publish: false
    }));

    if (!editor)
        return null;

    return (
        <Drawer
            open={open}
            variant="persistent"
            anchor="right"
            className={editorPublishSidebarClasses.root}
            sx={{
                width: NAVIGATION_DRAWER_WIDTH,
                [`& .${drawerClasses.paper}`]: {
                    width: NAVIGATION_DRAWER_WIDTH,
                    position: { md: 'static' },
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 2,
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Tooltip title={translations.close}>
                    <IconButton onClick={handleCloseButtonClick}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h4" fontWeight={400}>
                    投稿の公開設定
                </Typography>
            </Box>
            <Divider flexItem sx={{ mx: 1.5 }} />
        </Drawer>
    );
};
