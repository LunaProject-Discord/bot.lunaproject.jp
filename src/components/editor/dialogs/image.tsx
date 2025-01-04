'use client';

import { MonospaceFontFamily } from '@/app/theme';
import { CancelButton } from '@/components/buttons';
import {
    EditorDialog,
    EditorDialogActions,
    EditorDialogContent,
    EditorDialogHeader,
    EditorDialogHeaderTab,
    EditorDialogHeaderTabs,
    insertContentAfter
} from '@/components/editor';
import { Field, FieldLabel, FieldRequired } from '@/components/field';
import { AddIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { editorAtom } from '@/states/editor';
import { REGEX_URL } from '@/utils/regex';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { OutlinedInput, outlinedInputClasses, useMediaQuery } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import React, { KeyboardEvent, useMemo } from 'react';

export type EditorImageDialogViewType = 'file' | 'url';

export const EditorImageDialog = ({ localization: { translations } }: LocalizationProps) => {
    const { editor } = useCurrentEditor();

    const isXSSize = useMediaQuery((theme) => theme.breakpoints.only('xs'));

    const [{ dialog }, setEditorState] = useAtom(editorAtom);

    const [viewType, setViewType, resetViewType] = useResettableState<EditorImageDialogViewType>('url');

    const [src, setSrc, resetSrc] = useResettableState('');
    const [alt, setAlt, resetAlt] = useResettableState('');

    const validUrl = useMemo(() => REGEX_URL.test(src), [src]);

    const handleDialogClose = () => {
        setEditorState((prevState) => ({
            ...prevState,
            dialog: undefined
        }));

        resetViewType();
        resetSrc();
        resetAlt();
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || e.key !== 'Enter')
            return;

        handleInsertButtonClick();
    };

    const handleInsertButtonClick = () => {
        if (!editor || !validUrl)
            return;

        insertContentAfter({
            type: 'image',
            src,
            alt
        })({
            editor,
            view: editor.view,
            state: editor.state
        });

        handleDialogClose();
    };

    if (!editor)
        return null;

    return (
        <EditorDialog
            open={dialog === 'image'}
            onClose={handleDialogClose}
            fullScreen={isXSSize}
        >
            <EditorDialogHeader>
                <EditorDialogHeaderTabs value={viewType}>
                    <EditorDialogHeaderTab
                        value="file"
                        label={translations.file}
                        onClick={() => setViewType('file')}
                        disabled
                    />
                    <EditorDialogHeaderTab
                        value="url"
                        label={translations.link}
                        onClick={() => setViewType('url')}
                    />
                </EditorDialogHeaderTabs>
            </EditorDialogHeader>
            <EditorDialogContent>
                <Field>
                    <FieldLabel htmlFor="src">
                        {translations.image_source_url}
                        <FieldRequired />
                    </FieldLabel>
                    <OutlinedInput
                        value={src}
                        onChange={(e) => setSrc(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        type="url"
                        required
                        size="small"
                        margin="none"
                        fullWidth
                        id="src"
                        sx={{
                            [`& .${outlinedInputClasses.input}`]: {
                                fontFamily: MonospaceFontFamily
                            }
                        }}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="alt">{translations.image_alternative_text}</FieldLabel>
                    <OutlinedInput
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        type="text"
                        size="small"
                        margin="none"
                        fullWidth
                        id="alt"
                    />
                </Field>
            </EditorDialogContent>
            <EditorDialogActions>
                <CancelButton onClick={handleDialogClose} variant="outlined" corners="extended">
                    {translations.cancel}
                </CancelButton>
                <Button
                    onClick={handleInsertButtonClick}
                    disabled={!validUrl}
                    disableElevation
                    variant="contained"
                    corners="extended"
                    startIcon={<AddIcon />}
                >
                    {translations.insert}
                </Button>
            </EditorDialogActions>
        </EditorDialog>
    );
};
