'use client';

import {
    editorClasses,
    editorDefaultExtensions,
    EditorHeader,
    EditorLinkSelectionMenu,
    EditorNavigationSidebar,
    EditorPublishSidebar,
    EditorRoot,
    EditorSelectionMenu,
    EditorTitleInput,
    RibbonTabs
} from '@/components/editor';
import { DockToLeftFillIcon, DockToLeftIcon, DockToRightFillIcon, DockToRightIcon } from '@/components/icons';
import { CreateGuildWebPageContent, GuildWebPage, GuildWebPageContent } from '@/interfaces/bot';
import { GuildViewProps, UserViewProps } from '@/interfaces/view';
import { editorAtom } from '@/states/editor';
import { Dialog, DialogContent } from '@lunaproject/web-core/dist/components/Dialog';
import { NAVIGATION_DRAWER_WIDTH } from '@lunaproject/web-core/dist/components/Navigation';
import { useDebounce } from '@lunaproject/web-core/dist/utils';
import { Box, dialogClasses } from '@mui/material';
import { getHierarchicalIndexes, TableOfContents } from '@tiptap-pro/extension-table-of-contents';
import { EditorContent, EditorContext, JSONContent, useEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import React, { Fragment, KeyboardEvent, useEffect, useMemo, useState } from 'react';

interface ViewProps extends UserViewProps, GuildViewProps {
    page: GuildWebPage;
}

export const View = ({ user, guild, page, localization }: ViewProps) => {
    const { translations, locale } = localization;

    const [
        {
            navigation: { open: navigationOpen },
            publish: publishOpen
        },
        setEditorState
    ] = useAtom(editorAtom);

    const [loaded, setLoaded] = useState(false);

    const latestPageContent = useMemo(() => {
        const contents = page.contents.toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1);
        return contents[0];

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const latestPageContentTitle = latestPageContent?.title ?? '';
    const latestPageContentContent: JSONContent = latestPageContent?.content ? JSON.parse(latestPageContent.content) : {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                attrs: {
                    textAlign: 'left'
                }
            }
        ]
    };

    const [title, setTitle] = useState(latestPageContentTitle);
    const [content, setContent] = useState(latestPageContentContent);

    const debouncedTitle = useDebounce(title, 1000);
    const debouncedContent = useDebounce(content, 1000);

    const editor = useEditor({
        content: latestPageContentContent,
        extensions: [
            ...editorDefaultExtensions,
            TableOfContents.configure({
                getId: (textContent) => encodeURIComponent(textContent),
                getIndex: getHierarchicalIndexes,
                onUpdate: (tableOfContents) => setEditorState((prevState) => ({
                    ...prevState,
                    navigation: {
                        open: prevState.navigation.open,
                        tableOfContents
                    }
                }))
            })
        ],
        editorProps: {
            attributes: {
                class: editorClasses.content
            }
        },
        onCreate: () => setLoaded(true),
        onUpdate: ({ editor }) => {
            if (!loaded)
                return;

            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'loading'
                }
            }));
            setContent(editor.getJSON());
        }
    });

    const handleTitleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.nativeEvent.isComposing)
            return;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                return;
            case 'ArrowDown':
            case 'Enter':
                e.preventDefault();

                if (editor)
                    editor.chain().focus().setTextSelection(0).run();
                return;
            default:
                return;
        }
    };

    useEffect(() => {
        if (!loaded)
            return;

        (async () => {
            const data: CreateGuildWebPageContent = {
                title: debouncedTitle,
                content: JSON.stringify(debouncedContent)
            };

            const response = await fetch(
                `/api/guilds/${guild.id}/web/articles/${page.id}/contents`,
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                setEditorState((prevState) => ({
                    ...prevState,
                    save: {
                        type: 'error'
                    }
                }));
                console.error('Failed to save page content!');
                return;
            }

            const pageContent: GuildWebPageContent = await response.json();

            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'success',
                    data: pageContent
                }
            }));
            console.log('Saved page content! ', pageContent);
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedContent, debouncedTitle, guild.id, page.id]);

    return (
        <Fragment>
            <Dialog
                open
                fullScreen
                sx={{
                    [`& .${dialogClasses.paper}`]: {
                        gap: 0,
                        overflow: 'hidden',
                        bgcolor: 'background.default',
                        backgroundImage: 'none'
                    }
                }}
            >
                <EditorContext.Provider value={{ editor }}>
                    <EditorHeader
                        tabs={[
                            RibbonTabs[0],
                            RibbonTabs[1],
                            {
                                name: 'view',
                                label: '表示',
                                accessKey: 'V',
                                content: [
                                    {
                                        name: 'sidebar',
                                        label: 'サイドバー',
                                        accessKey: 'S',
                                        content: [
                                            {
                                                name: 'navigation',
                                                icon: navigationOpen ? DockToRightFillIcon : DockToRightIcon,
                                                label: 'ナビゲーション',
                                                accessKey: 'N',
                                                selected: navigationOpen,
                                                perform: () => {
                                                    setEditorState((prevState) => ({
                                                        ...prevState,
                                                        navigation: {
                                                            ...prevState.navigation,
                                                            open: !prevState.navigation.open
                                                        }
                                                    }));
                                                    return true;
                                                }
                                            },
                                            {
                                                name: 'publish',
                                                icon: publishOpen ? DockToLeftFillIcon : DockToLeftIcon,
                                                label: '投稿の公開設定',
                                                accessKey: 'P',
                                                selected: publishOpen,
                                                perform: () => {
                                                    setEditorState((prevState) => ({
                                                        ...prevState,
                                                        publish: !prevState.publish
                                                    }));
                                                    return true;
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            RibbonTabs[3],
                            RibbonTabs[4]
                        ]}
                        user={user}
                        localization={localization}
                    />
                    <DialogContent
                        sx={{
                            p: 0,
                            flexDirection: 'row',
                            overflow: 'hidden'
                        }}
                    >
                        <EditorNavigationSidebar localization={localization} />
                        <Box
                            sx={(theme) => ({
                                '--content-width': (theme) => `minmax(auto, ${theme.breakpoints.values.md}px)`,
                                '--margin-width': (theme) => theme.spacing(2),

                                width: '100%',
                                ml: navigationOpen ? 0 : `-${NAVIGATION_DRAWER_WIDTH}px`,
                                mr: publishOpen ? 0 : `-${NAVIGATION_DRAWER_WIDTH}px`,
                                display: 'grid',
                                gridTemplateColumns: '[layout-start] var(--margin-width) [content-start] var(--content-width) [content-end] var(--margin-width) [layout-end]',
                                zIndex: 3,
                                overflowY: 'scroll',
                                transition: theme.transitions.create(
                                    'margin',
                                    (navigationOpen || publishOpen) ? {
                                        easing: theme.transitions.easing.easeOut,
                                        duration: theme.transitions.duration.enteringScreen
                                    } : {
                                        easing: theme.transitions.easing.sharp,
                                        duration: theme.transitions.duration.leavingScreen
                                    }
                                ),
                                [theme.breakpoints.up('md')]: {
                                    '--margin-width': (theme) => `minmax(${theme.spacing(12)}, 1fr)`
                                }
                            })}
                        >
                            <EditorRoot sx={{ gridColumn: 'content' }}>
                                <EditorTitleInput
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={handleTitleInputKeyDown}
                                    placeholder="ここにタイトルを入力..."
                                />
                                <EditorContext.Consumer>
                                    {({ editor: currentEditor }) => (
                                        <Fragment>
                                            <EditorContent editor={currentEditor} />
                                        </Fragment>
                                    )}
                                </EditorContext.Consumer>
                            </EditorRoot>
                        </Box>
                        <EditorPublishSidebar localization={localization} />
                    </DialogContent>

                    <EditorSelectionMenu />
                    <EditorLinkSelectionMenu />
                </EditorContext.Provider>
            </Dialog>
        </Fragment>
    );
};
