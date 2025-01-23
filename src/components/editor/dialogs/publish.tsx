'use client';

import { publish } from '@/app/dashboard/[id]/web/articles/[slug]/utils';
import { CancelButton } from '@/components/buttons';
import { EditorDialog, EditorDialogActions, EditorDialogContent, EditorDialogHeader } from '@/components/editor';
import { Field, FieldLabel } from '@/components/field';
import { CheckIcon } from '@/components/icons';
import { Key } from '@/components/text';
import { LocalizationProps } from '@/interfaces/localization';
import { editorAtom } from '@/states/editor';
import { LoadingButton } from '@lunaproject/web-core/dist/components/Button';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { Box, OutlinedInput, useMediaQuery } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { KeyboardEvent, useCallback } from 'react';
import { isMacOs } from 'react-device-detect';

export const EditorPublishDialog = ({ localization: { translations } }: LocalizationProps) => {
    const router = useRouter();

    const isXSSize = useMediaQuery((theme) => theme.breakpoints.only('xs'));

    const { editor } = useCurrentEditor();

    const [{ dialog, save }, setEditorState] = useAtom(editorAtom);

    const [comment, setComment, resetComment] = useResettableState(() => {
        if (save?.type !== 'success')
            return '';

        const page = save.data;
        const pageContents = page.contents.toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1);
        if (pageContents.length < 1)
            return '';

        return pageContents[0].comment || '';
    });

    const handleDialogClose = () => {
        setEditorState((prevState) => ({
            ...prevState,
            dialog: undefined
        }));

        resetComment();
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || e.key !== 'Enter')
            return;

        const isCommandOrCtrlKey = isMacOs ? e.metaKey : e.ctrlKey;
        if (!isCommandOrCtrlKey)
            return;

        e.preventDefault();
        handlePublishButtonClick();
    };

    const handlePublishButtonClick = async () => {
        if (!editor || !editor.isInitialized || editor.isDestroyed || save?.type !== 'success')
            return;

        setEditorState((prevState) => ({
            ...prevState,
            save: {
                type: 'loading'
            }
        }));

        const page = save.data;
        const pageContents = page.contents.toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1);
        if (pageContents.length < 1) {
            setEditorState((prevState) => ({
                ...prevState,
                save: {
                    type: 'error'
                }
            }));
            return;
        }

        const pageContentId = pageContents[0].id;

        const newPage = await publish(
            page.guildId,
            page.id,
            pageContentId,
            {
                page: {
                    content: pageContentId,
                    category: page.category?.id,
                    tags: page.tags.map((tag) => tag.id)
                },
                content: {
                    published: true,
                    comment: comment || undefined
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

        handleDialogClose();
    };

    const focusInput = useCallback((element: HTMLInputElement | null) => {
        if (!element)
            return;

        element.focus();
    }, []);

    if (!editor)
        return null;

    return (
        <EditorDialog
            open={dialog === 'publish'}
            onClose={handleDialogClose}
            fullScreen={isXSSize}
        >
            <EditorDialogHeader>
                この版を公開する
            </EditorDialogHeader>
            <EditorDialogContent>
                <Field>
                    <FieldLabel htmlFor="comment">
                        コメント
                    </FieldLabel>
                    <OutlinedInput
                        inputRef={focusInput}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        type="text"
                        multiline
                        rows={3}
                        size="small"
                        margin="none"
                        fullWidth
                        id="comment"
                    />
                </Field>
            </EditorDialogContent>
            <EditorDialogActions>
                <CancelButton onClick={handleDialogClose} variant="outlined" corners="extended">
                    {translations.cancel}
                </CancelButton>
                <LoadingButton
                    onClick={handlePublishButtonClick}
                    loading={save?.type === 'loading'}
                    loadingPosition="start"
                    disableElevation
                    variant="contained"
                    corners="extended"
                    startIcon={<CheckIcon />}
                >
                    公開
                    <Box sx={{ ml: 1, mr: -.5, display: 'flex', alignItems: 'center', gap: .25, lineHeight: 1 }}>
                        <Key>{isMacOs ? '⌘' : 'Ctrl'}</Key>
                        +
                        <Key>{isMacOs ? '⮐' : 'Enter'}</Key>
                    </Box>
                </LoadingButton>
            </EditorDialogActions>
        </EditorDialog>
    );
};
