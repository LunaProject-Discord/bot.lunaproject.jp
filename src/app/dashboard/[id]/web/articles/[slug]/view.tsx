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
import { ErrorDescription, ErrorTitle } from '@/components/error';
import { ArrowBackIcon, CloudOffIcon } from '@/components/icons';
import { GuildWebCategory, GuildWebPage, GuildWebTag } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { GuildViewProps, UserViewProps } from '@/interfaces/view';
import { editorAtom } from '@/states/editor';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { Dialog, DialogContent } from '@lunaproject/web-core/dist/components/Dialog';
import { NAVIGATION_DRAWER_WIDTH } from '@lunaproject/web-core/dist/components/Navigation';
import { useDebounce } from '@lunaproject/web-core/dist/utils';
import { Box, CircularProgress, dialogClasses } from '@mui/material';
import { getHierarchicalIndexes, TableOfContents } from '@tiptap-pro/extension-table-of-contents';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { isMacOs } from 'react-device-detect';
import { tinykeys } from 'tinykeys';
import { save } from './utils';

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

    const router = useRouter();

    const [
        {
            save: saveState,
            navigation: { open: navigationOpen },
            publish: publishOpen
        },
        setEditorState
    ] = useAtom(editorAtom);

    const latestPageContent = useMemo(() => {
        const pageContents = page.contents.toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1);
        return pageContents[0];

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const latestPageContentTitle = latestPageContent?.title ?? '';
    const latestPageContentContent = latestPageContent?.content ?? {
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
    const [category, setCategory] = useState(page.category?.id);
    const [tags, setTags] = useState(page.tags.map((tag) => tag.id));

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
            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'success',
                    data: page
                }
            }));
        },
        onUpdate: ({ editor }) => {
            if (!editor.isInitialized || editor.isDestroyed)
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

    const handleTitleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
        const unsubscribe = tinykeys(
            window,
            {
                '$mod+s': async (e) => {
                    e.preventDefault();

                    if (!editor || !editor.isInitialized || editor.isDestroyed)
                        return;

                    setEditorState((prevState) => ({
                        ...prevState,
                        save: {
                            type: 'loading'
                        }
                    }));

                    const newPage = await save(
                        guild.id,
                        page.id,
                        {
                            page: {
                                category,
                                tags
                            },
                            content: {
                                title: debouncedTitle,
                                content: debouncedContent,
                                autoSave: e.code === 'AutoSave'
                            }
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

                    router.refresh();
                },
                '$mod+p': (e) => {
                    e.preventDefault();

                    setEditorState((prevState) => ({
                        ...prevState,
                        dialog: 'publish'
                    }));
                }
            }
        );

        return () => unsubscribe();
    }, [category, debouncedContent, debouncedTitle, editor, guild.id, page.id, router, saveState, setEditorState, tags]);

    useEffect(() => {
        if (!editor || !editor.isInitialized || editor.isDestroyed)
            return;

        window.dispatchEvent(
            new KeyboardEvent(
                'keydown',
                {
                    key: 's',
                    ctrlKey: !isMacOs,
                    metaKey: isMacOs,
                    code: 'AutoSave'
                }
            )
        );

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
                            id="editor"
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
                            <EditorRoot localization={localization} sx={{ gridColumn: 'content' }}>
                                <EditorTitleInput
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={handleTitleInputKeyDown}
                                    placeholder={translations.web_page_editor_title_placeholder as string}
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
                                        <EditorContent editor={currentEditor} />
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

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
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
        <DialogContent sx={{ display: 'flex', placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </DialogContent>
    </Dialog>
);

export const NotFoundView = ({ id, localization: { translations } }: LocalizationProps & { id: string; }) => (
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
        <DialogContent
            sx={{
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                placeContent: 'center',
                gap: 1
            }}
        >
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>{translations.error_not_found_title}</ErrorTitle>
            <ErrorDescription>{translations.error_not_found_description}</ErrorDescription>
            <Button
                component={NextLink}
                href={`/dashboard/${id}/web/articles`}
                prefetch={false}
                disableElevation
                variant="contained"
                corners="extended"
                size="large"
                startIcon={<ArrowBackIcon />}
            >
                {translations.back}
            </Button>
        </DialogContent>
    </Dialog>
);
