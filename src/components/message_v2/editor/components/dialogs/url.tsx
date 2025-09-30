'use client';

import { MonospaceFontFamily } from '@/app/theme';
import { CancelButton } from '@/components/buttons';
import { DeleteIcon, SaveIcon } from '@/components/icons';
import { Key } from '@/components/text';
import { LocalizationProps } from '@/interfaces/localization';
import { REGEX_URL } from '@/utils/regex';
import { BottomSheet, BottomSheetContent } from '@lunaproject/web-core/dist/components/BottomSheet';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@lunaproject/web-core/dist/components/Dialog';
import { MuiDefaultTheme } from '@lunaproject/web-core/dist/utils';
import {
    Box,
    dialogContentClasses,
    dialogTitleClasses,
    OutlinedInput,
    outlinedInputClasses,
    Typography,
    useMediaQuery
} from '@mui/material';
import React, { ChangeEvent, KeyboardEvent, useMemo, useRef, useState } from 'react';
import { createCallable } from 'react-call';
import { isMacOs } from 'react-device-detect';

export interface MessageEditorUrlDialogProps {
    value?: string;
}

export type MessageEditorUrlDialogResult = { type: 'set'; value: string; } | { type: 'reset'; } | { type: 'cancel'; };

export const MessageEditorUrlDialog = createCallable<
    MessageEditorUrlDialogProps,
    MessageEditorUrlDialogResult,
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
            value: initialValue
        }
    ) => {
        const { locale, translations } = localization;

        const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));

        const saveButtonRef = useRef<HTMLButtonElement | null>(null);

        const [value, setValue] = useState(initialValue || '');
        const isValid = useMemo(() => REGEX_URL.test(value), [value]);

        const handleDialogClose = () => end({ type: 'cancel' });

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

        const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.nativeEvent.isComposing || e.key !== 'Enter')
                return;

            e.preventDefault();
            handleSaveButtonClick();
        };

        const handleSaveButtonClick = () => {
            if (!isValid)
                return;

            end({ type: 'set', value });
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
                    <DialogTitle>URL を設定</DialogTitle>
                    <DialogContent>
                        <OutlinedInput
                            value={value}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            type="url"
                            inputProps={{
                                inputMode: 'url'
                            }}
                            required
                            autoFocus
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
                    </DialogContent>
                    <DialogActions>
                        {(initialValue && initialValue.length > 0) && <Button
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
                            {(initialValue && initialValue.length > 0) && <Button
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
                        <OutlinedInput
                            value={value}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            type="url"
                            inputProps={{
                                inputMode: 'url'
                            }}
                            required
                            autoFocus
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
