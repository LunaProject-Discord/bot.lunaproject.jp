'use client';

import { MuiDarkTheme, MuiLightTheme } from '@lunaproject-discord/web-core';
import { DeleteOutlined, SaveOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, buttonClasses, Snackbar, snackbarContentClasses, ThemeProvider, useTheme } from '@mui/material';
import Mousetrap from 'mousetrap';
import { useRouter } from 'next/navigation';
import React, { MouseEvent, useEffect, useRef, useState, useTransition } from 'react';
import { useTranslation } from '../../languages/client';
import { Hotkey } from '../text';

interface Props {
    open: boolean;
    disableKeyboardShortcuts?: boolean;
    onSave: () => Promise<boolean>;
    onCancel: () => void;
}

export const SaveConfirm = ({ open, disableKeyboardShortcuts, onSave, onCancel }: Props) => {
    const router = useRouter();

    const translations = useTranslation();

    const theme = useTheme();
    const invertedTheme = theme.palette.mode === 'light' ? MuiDarkTheme : MuiLightTheme;

    const saveButton = useRef<HTMLButtonElement | null>(null);
    const cancelButton = useRef<HTMLButtonElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        Mousetrap.bind('s', (e) => {
            e.preventDefault();

            if (!open || disableKeyboardShortcuts || loading || pending || !saveButton.current)
                return;

            saveButton.current?.click();
        });
        Mousetrap.bind('r c', (e) => {
            e.preventDefault();

            if (!open || disableKeyboardShortcuts || !cancelButton.current)
                return;

            cancelButton.current?.click();
        });

        return () => {
            Mousetrap.unbind('s');
            Mousetrap.unbind('r c');
        };
    }, [open, disableKeyboardShortcuts, loading]);

    const handleClickSaveButton = async (e: MouseEvent<HTMLButtonElement>) => {
        setLoading(true);

        const result = await onSave();
        if (result)
            startTransition(() => router.refresh());

        setLoading(false);
    };

    return (
        <ThemeProvider theme={invertedTheme}>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message="データを保存しますか？"
                action={
                    <ThemeProvider theme={theme}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: .75 }}>
                            <Button
                                ref={cancelButton}
                                onClick={onCancel}
                                color="inherit"
                                startIcon={<DeleteOutlined />}
                                sx={{
                                    gap: .5,
                                    [`& .${buttonClasses.startIcon}, & .${buttonClasses.endIcon}`]: {
                                        m: 0
                                    }
                                }}
                            >
                                {translations.reset}
                                <Hotkey>r c</Hotkey>
                            </Button>
                            <LoadingButton
                                ref={saveButton}
                                onClick={handleClickSaveButton}
                                loading={loading || pending}
                                loadingPosition="start"
                                startIcon={<SaveOutlined />}
                                variant="contained"
                            >
                                {translations.save}
                                <Hotkey sx={{ ml: 1, mr: -.5 }}>s</Hotkey>
                            </LoadingButton>
                        </Box>
                    </ThemeProvider>
                }
                sx={{
                    [`& .${snackbarContentClasses.root}`]: {
                        border: `solid 1px ${theme.palette.divider}`,
                        boxShadow: (theme) => `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
                    }
                }}
            />
        </ThemeProvider>
    );
};
