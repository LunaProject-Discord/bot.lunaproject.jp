'use client';

import { EditorRibbonTabs } from '@/components/editor';
import {
    CloseIcon,
    CloudSyncIcon,
    NotificationsIcon,
    RedoIcon,
    SaveIcon,
    SyncProblemIcon,
    UndoIcon
} from '@/components/icons';
import { GuildViewProps, UserViewProps } from '@/interfaces/view';
import { editorAtom } from '@/states/editor';
import { getUserAvatar, getUserDisplayName } from '@/utils/discord';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { YudzukiIcon } from '@lunaproject/web-core/dist/components/Icons';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import {
    RibbonDivider,
    RibbonGroupRoot,
    RibbonProvider,
    RibbonTabContext,
    RibbonTabHeader,
    RibbonTabPanel,
    RibbonTabs
} from '@lunaproject/web-editor';
import {
    Avatar,
    Box,
    BoxProps,
    Collapse,
    IconButton,
    styled,
    svgIconClasses,
    Tooltip,
    Typography
} from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
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
    boxShadow: `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgb(0 0 0 / .15)`,
    ...theme.applyStyles('dark', {
        backgroundImage: theme.vars.overlays[8]
    })
}));

export type EditorHeaderProps = UserViewProps & GuildViewProps;

export const EditorHeader = ({ user, guild, localization }: EditorHeaderProps) => {
    const { translations } = localization;

    const [{ save }, setEditorState] = useAtom(editorAtom);

    const { editor } = useCurrentEditor();
    if (!editor)
        return null;

    return (
        <RibbonProvider editor={editor} tabs={EditorRibbonTabs(localization)}>
            <EditorHeaderRoot>
                <RibbonTabHeader>
                    <Tooltip title={translations.close} placement="bottom">
                        <IconButton
                            component={NextLink}
                            href={`/dashboard/${guild.id}/web/articles`}
                            sx={{
                                [`& .${svgIconClasses.colorError}`]: {
                                    display: 'none'
                                },
                                ['&:hover, &:focus, &:active']: {
                                    [`& .${svgIconClasses.root}`]: {
                                        display: 'none'
                                    },
                                    [`& .${svgIconClasses.colorError}`]: {
                                        display: 'block'
                                    }
                                }
                            }}
                        >
                            <YudzukiIcon className="default" />
                            <CloseIcon color="error" />
                        </IconButton>
                    </Tooltip>
                    <RibbonDivider sx={{ my: 2, ml: -1 }} />
                    <RibbonGroupRoot>
                        <Tooltip title={translations.save} placement="bottom">
                            <IconButton>
                                {save?.type === 'success' && <CloudSyncIcon />}
                                {save?.type === 'error' && <SyncProblemIcon />}
                                {(!save || save.type === 'loading') && <SaveIcon />}
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
                        {save?.type === 'success' && '保存済み'}
                        {save?.type === 'error' && '保存できませんでした'}
                        {save?.type === 'loading' && '保存中...'}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <Button
                            component={NextLink}
                            href={save?.type === 'success' ? `/guilds/${guild.id}/articles/${save.data.pageId.toLowerCase()}/revisions/${save.data.id.toLowerCase()}` : '#'}
                            target="_blank"
                            disabled={!save || save.type !== 'success'}
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

export * from './ribbon';
