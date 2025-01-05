'use client';

import {
    EditorCategorySelectButton,
    editorClasses,
    editorDefaultExtensions,
    EditorDialogs,
    EditorHeader,
    EditorLinkSelectionMenu,
    EditorNavigationSidebar,
    EditorPublishSidebar,
    EditorRoot,
    EditorSelectionMenu,
    EditorTagSelectButton,
    EditorTitleInput
} from '@/components/editor';
import { GuildWebCategory, GuildWebPage, GuildWebTag } from '@/interfaces/bot';
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
import { saveGuildWebPage, saveGuildWebPageContent } from './utils';

interface ViewProps extends UserViewProps, GuildViewProps {
    page: GuildWebPage;
    categories: GuildWebCategory[];
    tags: GuildWebTag[];
}

export const View = (
    {
        user,
        guild,
        page,
        categories: guildWebCategories,
        tags: guildWebTags,
        localization
    }: ViewProps
) => {
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
        const pageContents = page.contents.toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1);
        return pageContents[0];

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
    const [category, setCategory] = useState<string | undefined>(page.category?.id);
    const [tags, setTags] = useState<string[]>(page.tags.map((tag) => tag.id));

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
        onCreate: () => {
            setLoaded(true);

            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'success',
                    data: page
                }
            }));
        },
        onUpdate: ({ editor }) => {
            if (!loaded)
                return;

            setContent(editor.getJSON());
            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'loading'
                }
            }));
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
            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'loading'
                }
            }));

            const newPageContent = await saveGuildWebPageContent(
                guild.id,
                page.id,
                {
                    title: debouncedTitle,
                    content: JSON.stringify(debouncedContent)
                }
            );

            if (!newPageContent) {
                setEditorState((prevState) => ({
                    ...prevState,
                    save: {
                        type: 'error'
                    }
                }));
                return;
            }

            const newPage = await saveGuildWebPage(
                guild.id,
                page.id,
                {
                    category,
                    tags
                }
            );

            if (!newPage) {
                setEditorState((prevState) => ({
                    ...prevState,
                    save: {
                        type: 'error'
                    }
                }));
                return;
            }

            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'success',
                    data: newPage
                }
            }));
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, debouncedContent, debouncedTitle, guild.id, page.id, tags]);

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
                    <EditorHeader user={user} guild={guild} localization={localization} />
                    <DialogContent sx={{ p: 0, flexDirection: 'row', overflow: 'hidden' }}>
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
                                <Box component="aside" sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <EditorCategorySelectButton
                                        value={category}
                                        setValue={setCategory}
                                        categories={guildWebCategories}
                                        localization={localization}
                                    />
                                    <EditorTagSelectButton
                                        value={tags}
                                        setValue={setTags}
                                        tags={guildWebTags}
                                        localization={localization}
                                    />
                                </Box>
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

                    <EditorDialogs localization={localization} />
                </EditorContext.Provider>
            </Dialog>
        </Fragment>
    );
};
