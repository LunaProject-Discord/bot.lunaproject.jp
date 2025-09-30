'use client';

import { MonospaceFontFamily } from '@/app/theme';
import { CancelButton } from '@/components/buttons';
import { AddIcon, DeleteIcon, DragIndicatorIcon, SaveIcon } from '@/components/icons';
import { Key } from '@/components/text';
import { LocalizationProps } from '@/interfaces/localization';
import { REGEX_URL } from '@/utils/regex';
import { BottomSheet, BottomSheetContent } from '@lunaproject/web-core/dist/components/BottomSheet';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@lunaproject/web-core/dist/components/Dialog';
import { MuiDefaultTheme } from '@lunaproject/web-core/dist/utils';
import {
    Box,
    Collapse,
    collapseClasses,
    dialogContentClasses,
    dialogTitleClasses,
    IconButton,
    OutlinedInput,
    outlinedInputClasses,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import React, { ChangeEvent, KeyboardEvent, MouseEvent, useMemo, useRef, useState } from 'react';
import { createCallable } from 'react-call';
import { isMacOs } from 'react-device-detect';
import { TransitionGroup } from 'react-transition-group';
import { ulid } from 'ulid';

type MessageEditorGalleryValue = { key: string; value: string; };

interface MessageEditorGalleryItemProps extends LocalizationProps {
    value: string;
    length: number;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onRemoveButtonClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const MessageEditorGalleryItem = (
    {
        value,
        length,
        onInputChange,
        onInputKeyDown,
        onRemoveButtonClick,
        localization: { translations }
    }: MessageEditorGalleryItemProps
) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
        }}
    >
        {length > 1 && <IconButton>
            <DragIndicatorIcon />
        </IconButton>}
        <OutlinedInput
            value={value}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            type="url"
            inputProps={{
                inputMode: 'url'
            }}
            required
            size="small"
            margin="none"
            fullWidth
            id="url"
            sx={{
                [`& .${outlinedInputClasses.input}`]: {
                    fontFamily: MonospaceFontFamily
                }
            }}
        />
        {length > 1 && <Tooltip title={translations.remove}>
            <IconButton onClick={onRemoveButtonClick} color="error">
                <DeleteIcon />
            </IconButton>
        </Tooltip>}
    </Box>
);

export interface MessageEditorGalleryDialogProps {
    values: string[];
}

export type MessageEditorGalleryDialogResult =
    { type: 'set'; values: string[]; }
    | { type: 'reset'; }
    | { type: 'cancel'; };

export const MessageEditorGalleryDialog = createCallable<
    MessageEditorGalleryDialogProps,
    MessageEditorGalleryDialogResult,
    LocalizationProps
>(
    (
        {
            call: {
                end,
                ended,
                root: {
                    localization
                }
            },
            values: initialValues
        }
    ) => {
        const { locale, translations } = localization;

        const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));

        const saveButtonRef = useRef<HTMLButtonElement | null>(null);

        const [values, setValues] = useState<MessageEditorGalleryValue[]>((initialValues.length > 0 ? initialValues : ['']).map((initialValue) => ({
            key: ulid(),
            value: initialValue
        })));
        const isValid = useMemo(() => values.every(({ value }) => value.length < 1 || REGEX_URL.test(value)), [values]);

        const handleDialogClose = () => end({ type: 'cancel' });

        const handleInputChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => setValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index].value = e.target.value;
            return newValues;
        });

        const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.nativeEvent.isComposing || e.key !== 'Enter')
                return;

            e.preventDefault();
            handleSaveButtonClick();
        };

        const handleAddButtonClick = () => setValues((prevValues) => {
            if (prevValues.length > 3)
                return prevValues;

            return [
                ...prevValues,
                {
                    key: ulid(),
                    value: ''
                }
            ];
        });

        const handleRemoveButtonClick = (index: number) => (e: MouseEvent<HTMLButtonElement>) => setValues((prevValues) => {
            if (prevValues.length < 2)
                return prevValues;

            return prevValues.toSpliced(index, 1);
        });

        const handleSaveButtonClick = () => {
            if (!isValid)
                return;

            end({ type: 'set', values: values.map(({ value }) => value) });
        };

        const handleDeleteButtonClick = () => end({ type: 'reset' });

        if (isSmall) {
            return (
                <Dialog
                    open={!ended}
                    onClose={handleDialogClose}
                    fullWidth
                    maxWidth="sm"
                    sx={{
                        [`& .${dialogTitleClasses.root} + .${dialogContentClasses.root}`]: {
                            pt: .125
                        }
                    }}
                >
                    <DialogTitle>
                        画像を設定
                        <Button
                            onClick={handleAddButtonClick}
                            disabled={values.length > 3}
                            disableElevation
                            variant="outlined"
                            corners="extended"
                            startIcon={<AddIcon />}
                            sx={{ ml: 'auto' }}
                        >
                            {translations.add}
                        </Button>
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            [`& .${collapseClasses.root}:not(:first-child)`]: {
                                mt: 1
                            }
                        }}
                    >
                        <TransitionGroup>
                            {values.map(({ key, value }, i) => (
                                <Collapse key={key}>
                                    <MessageEditorGalleryItem
                                        value={value}
                                        length={values.length}
                                        onInputChange={handleInputChange(i)}
                                        onInputKeyDown={handleInputKeyDown}
                                        onRemoveButtonClick={handleRemoveButtonClick(i)}
                                        localization={localization}
                                    />
                                </Collapse>
                            ))}
                        </TransitionGroup>
                    </DialogContent>
                    <DialogActions>
                        {initialValues.some((value) => value.length > 0) && <Button
                            onClick={handleDeleteButtonClick}
                            variant="outlined"
                            corners="extended"
                            color="error"
                            startIcon={<DeleteIcon />}
                            sx={{ mr: 'auto' }}
                        >
                            {translations.delete}
                        </Button>}
                        <CancelButton onClick={handleDialogClose} variant="outlined" corners="extended">
                            {translations.cancel}
                        </CancelButton>
                        <Button
                            ref={saveButtonRef}
                            onClick={handleSaveButtonClick}
                            disabled={!isValid}
                            disableElevation
                            variant="contained"
                            corners="extended"
                            startIcon={<SaveIcon />}
                        >
                            {translations.save}
                            <Key sx={{ ml: 1, mr: -.5 }}>
                                {isMacOs ? '⮐' : 'Enter'}
                            </Key>
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return (
                <BottomSheet
                    open={!ended}
                    onDismiss={handleDialogClose}
                    header={
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 1
                            }}
                        >
                            <Typography>
                                URL を設定
                            </Typography>
                            {initialValues.some((value) => value.length > 0) && <Button
                                onClick={handleDeleteButtonClick}
                                variant="outlined"
                                corners="extended"
                                color="error"
                                startIcon={<DeleteIcon />}
                            >
                                {translations.delete}
                            </Button>}
                        </Box>
                    }
                >
                    <BottomSheetContent>
                        <Box
                            sx={{
                                [`& .${collapseClasses.root}:not(:first-child)`]: {
                                    mt: 1
                                }
                            }}
                        >
                            <TransitionGroup>
                                {values.map(({ key, value }, i) => (
                                    <Collapse key={key}>
                                        <MessageEditorGalleryItem
                                            value={value}
                                            length={values.length}
                                            onInputChange={handleInputChange(i)}
                                            onInputKeyDown={handleInputKeyDown}
                                            onRemoveButtonClick={handleRemoveButtonClick(i)}
                                            localization={localization}
                                        />
                                    </Collapse>
                                ))}
                                {values.length < 4 && <Collapse>
                                    <Button
                                        onClick={handleAddButtonClick}
                                        disableElevation
                                        variant="outlined"
                                        corners="extended"
                                        fullWidth
                                        startIcon={<AddIcon />}
                                    >
                                        {translations.add}
                                    </Button>
                                </Collapse>}
                            </TransitionGroup>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5
                            }}
                        >
                            <Button
                                ref={saveButtonRef}
                                onClick={handleSaveButtonClick}
                                disabled={!isValid}
                                disableElevation
                                variant="contained"
                                corners="extended"
                                size="large"
                                fullWidth
                                startIcon={<SaveIcon />}
                            >
                                {translations.save}
                            </Button>
                        </Box>
                    </BottomSheetContent>
                </BottomSheet>
            );
        }
    },
    MuiDefaultTheme.transitions.duration.leavingScreen
);
