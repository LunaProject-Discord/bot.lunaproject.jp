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
    EditorDialogSwitchControl,
    insertContentAfter
} from '@/components/editor';
import { Field, FieldLabel, FieldRequired } from '@/components/field';
import { AddIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { editorAtom } from '@/states/editor';
import { REGEX_URL } from '@/utils/regex';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { REGEX_NICONICO, REGEX_YOUTUBE } from '@lunaproject/web-editor';
import { OutlinedInput, outlinedInputClasses, useMediaQuery } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import React, { KeyboardEvent, useMemo } from 'react';

export type EditorVideoDialogViewType = 'file' | 'url' | 'youtube' | 'niconico';

export const EditorVideoDialog = ({ localization: { translations } }: LocalizationProps) => {
    const isXSSize = useMediaQuery((theme) => theme.breakpoints.only('xs'));

    const { editor } = useCurrentEditor();

    const [{ dialog }, setEditorState] = useAtom(editorAtom);

    const [viewType, setViewType, resetViewType] = useResettableState<EditorVideoDialogViewType>('url');

    const [src, setSrc, resetSrc] = useResettableState('');
    const [controls, setControls, resetControls] = useResettableState(true);
    const [loop, setLoop, resetLoop] = useResettableState(false);
    const [muted, setMuted, resetMuted] = useResettableState(false);

    const validUrl = useMemo(() => REGEX_URL.test(src), [src]);

    const handleDialogClose = () => {
        setEditorState((prevState) => ({
            ...prevState,
            dialog: undefined
        }));

        resetViewType();
        resetSrc();
        resetControls();
        resetLoop();
        resetMuted();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSrc(value);

        resetControls();
        resetLoop();
        resetMuted();

        if (REGEX_YOUTUBE.test(value)) {
            setViewType('youtube');
            return;
        }

        if (REGEX_NICONICO.test(value)) {
            setViewType('niconico');
            return;
        }

        setViewType('url');
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
            type: 'video',
            src,
            controls,
            loop,
            muted
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
            open={dialog === 'video'}
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
                        disabled={viewType !== 'url' && src.length > 0}
                    />
                    <EditorDialogHeaderTab
                        value="youtube"
                        label={translations.music_source_youtube}
                        onClick={() => setViewType('youtube')}
                        disabled={viewType !== 'youtube' && src.length > 0}
                    />
                    <EditorDialogHeaderTab
                        value="niconico"
                        label={translations.music_source_niconico}
                        onClick={() => setViewType('niconico')}
                        disabled={viewType !== 'niconico' && src.length > 0}
                    />
                </EditorDialogHeaderTabs>
            </EditorDialogHeader>
            <EditorDialogContent>
                <Field>
                    <FieldLabel htmlFor="src">
                        {translations.video_source_url}
                        <FieldRequired />
                    </FieldLabel>
                    <OutlinedInput
                        value={src}
                        onChange={handleInputChange}
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
                {viewType !== 'niconico' && <Section sx={{ p: 0 }}>
                    <SectionTitle component="h4" variant="h4">{translations.options}</SectionTitle>
                    <SectionContent>
                        {viewType === 'youtube' && <EditorDialogSwitchControl
                            label={translations.media_enabled_controls}
                            checked={controls}
                            setChecked={setControls}
                        />}
                        <EditorDialogSwitchControl
                            label={translations.media_enabled_loop}
                            checked={loop}
                            setChecked={setLoop}
                        />
                        <EditorDialogSwitchControl
                            label={translations.media_default_muted}
                            checked={muted}
                            setChecked={setMuted}
                        />
                    </SectionContent>
                </Section>}
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
