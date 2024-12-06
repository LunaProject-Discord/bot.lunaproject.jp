'use client';

import { EditorSidebarProps } from '@/components/editor';
import { CloseIcon } from '@/components/icons';
import { editorAtom } from '@/states/editor';
import { NAVIGATION_DRAWER_WIDTH } from '@lunaproject/web-core/dist/components/Navigation';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import {
    Box,
    Divider,
    Drawer,
    drawerClasses,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography
} from '@mui/material';
import { TextSelection } from '@tiptap/pm/state';
import { useCurrentEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import React, { useCallback } from 'react';

export const editorNavigationSidebarClasses = generateComponentClasses(
    'EditorNavigationSidebar',
    [
        'root',
        'tableOfContents'
    ]
);

export const EditorNavigationSidebar = ({ localization: { translations } }: EditorSidebarProps) => {
    const [{ navigation: { open, tableOfContents } }, setEditorState] = useAtom(editorAtom);

    const { editor } = useCurrentEditor();

    const handleCloseButtonClick = () => setEditorState((prevState) => ({
        ...prevState,
        navigation: {
            ...prevState.navigation,
            open: false
        }
    }));

    const handleListItemButtonClick = useCallback((id: string) => () => {
        if (!editor)
            return;

        const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
        if (!element)
            return;

        const position = editor.view.posAtDOM(element, 0);

        const transaction = editor.view.state.tr;
        transaction.setSelection(new TextSelection(transaction.doc.resolve(position)));
        editor.view.dispatch(transaction);

        editor.view.focus();
        element.scrollIntoView({ behavior: 'smooth' });
    }, [editor]);

    if (!editor)
        return null;

    return (
        <Drawer
            open={open}
            variant="persistent"
            anchor="left"
            className={editorNavigationSidebarClasses.root}
            sx={{
                width: NAVIGATION_DRAWER_WIDTH,
                [`& .${drawerClasses.paper}`]: {
                    width: NAVIGATION_DRAWER_WIDTH,
                    position: { md: 'static' },
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1,
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
                    ナビゲーション
                </Typography>
            </Box>
            <Divider flexItem sx={{ mx: 1.5 }} />
            <List sx={{ p: 1.5, overflowY: 'auto' }}>
                {tableOfContents.map((item) => (
                    <ListItemButton
                        key={item.id}
                        onClick={handleListItemButtonClick(item.id)}
                        sx={{
                            pl: 1.5 + (item.level - 2),
                            pr: 1.5,
                            py: 1,
                            borderRadius: 1
                        }}
                    >
                        <ListItemText primary={item.textContent} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};
