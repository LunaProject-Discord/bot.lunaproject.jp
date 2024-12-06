'use client';

import { EditorSaveState } from '@/components/editor';
import { NotificationsIcon, RedoIcon, SaveIcon, UndoIcon } from '@/components/icons';
import { UserViewProps } from '@/interfaces/view';
import { editorAtom } from '@/states/editor';
import { getUserAvatar, getUserDisplayName } from '@/utils/discord';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { YudzukiIcon } from '@lunaproject/web-core/dist/components/Icons';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import {
    EditorRibbonTab,
    RibbonDivider,
    RibbonGroupRoot,
    RibbonProvider,
    RibbonTabContentRoot,
    RibbonTabContext,
    RibbonTabPanel,
    RibbonTabs
} from '@lunaproject/web-editor';
import { Avatar, Box, BoxProps, Collapse, IconButton, styled, Tooltip, Typography } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import React, { Fragment } from 'react';

export const editorHeaderClasses = generateComponentClasses(
    'EditorHeader',
    [
        'root'
    ]
);

export const EditorHeaderRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            component="header"
            className={clsx(editorHeaderClasses.root, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    padding: theme.spacing(0, .5),
    display: 'flex',
    flexDirection: 'column',
    zIndex: 4,
    backgroundColor: theme.vars.palette.background.paper,
    boxShadow: `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgb(0 0 0 / .15)`
}));

export interface EditorHeaderProps extends UserViewProps {
    tabs: EditorRibbonTab[];
    saveState: EditorSaveState;
}

export const EditorHeader = ({ tabs, saveState, user, localization: { translations } }: EditorHeaderProps) => {
    const setEditorState = useSetAtom(editorAtom);

    const { editor } = useCurrentEditor();
    if (!editor)
        return null;

    return (
        <RibbonProvider editor={editor} tabs={tabs}>
            <EditorHeaderRoot>
                <RibbonTabContentRoot>
                    <Box
                        sx={(theme) => ({
                            width: theme.spacing(5),
                            height: theme.spacing(5),
                            display: 'flex',
                            placeItems: 'center',
                            placeContent: 'center'
                        })}
                    >
                        <YudzukiIcon />
                    </Box>
                    <RibbonDivider sx={{ my: 2, ml: -1 }} />
                    <RibbonGroupRoot>
                        <Tooltip title={translations.save} placement="bottom">
                            <IconButton>
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.undo} placement="bottom">
                            <IconButton
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                            >
                                <UndoIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.redo} placement="bottom">
                            <IconButton
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                            >
                                <RedoIcon />
                            </IconButton>
                        </Tooltip>
                    </RibbonGroupRoot>
                    <RibbonDivider sx={{ my: 2, mr: 1 }} />
                    <RibbonTabs editor={editor} />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mx: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        {saveState === 'success' && '保存済み'}
                        {saveState === 'failed' && '保存できませんでした'}
                        {saveState === 'saving' && '保存中...'}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <Button
                            variant="outlined"
                            corners="extended"
                        >
                            プレビュー
                        </Button>
                        <Button
                            onClick={() => setEditorState((prevState) => ({
                                ...prevState,
                                publish: !prevState.publish
                            }))}
                            disableElevation
                            variant="contained"
                            corners="extended"
                        >
                            投稿を公開する
                        </Button>
                    </Box>
                    {user && <Fragment>
                        <RibbonDivider sx={{ my: 2 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: .5
                            }}
                        >
                            <Tooltip title={translations.notifications} placement="bottom">
                                <IconButton>
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={getUserDisplayName(user)} placement="bottom">
                                <IconButton sx={{ p: .5 }}>
                                    <Avatar
                                        src={getUserAvatar(user)}
                                        sx={{ width: 32, height: 32, pointerEvents: 'none' }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Fragment>}
                </RibbonTabContentRoot>
                <RibbonTabContext.Consumer>
                    {({ open }) => (
                        <Collapse in={open} mountOnEnter unmountOnExit>
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
