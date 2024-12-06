'use client';

import { RefreshIcon, SaveIcon } from '@/components/icons';
import { useTranslation } from '@/localizations/client';
import { appearanceAtom } from '@/states/appearance';
import { borderAndBoxShadow } from '@lunaproject/web-core/dist/utils';
import { LoadingButton } from '@mui/lab';
import { Box, Button, buttonClasses, Snackbar, snackbarContentClasses } from '@mui/material';
import { useAtomValue } from 'jotai';
import Mousetrap from 'mousetrap';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { Key } from '../text';

interface Props {
    open: boolean;
    disableKeyboardShortcuts?: boolean;
    onSave: () => Promise<boolean>;
    onCancel: () => void;
}

export const SaveConfirm = ({ open, disableKeyboardShortcuts, onSave, onCancel }: Props) => {
    const router = useRouter();

    const translations = useTranslation();

    const { isDarkMode } = useAtomValue(appearanceAtom);

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

    const handleSaveButtonClick = async () => {
        setLoading(true);

        const result = await onSave();
        if (result)
            startTransition(() => router.refresh());

        setLoading(false);
    };

    return (
        <Box className={isDarkMode ? 'light' : 'dark'}>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message="データを保存しますか？"
                action={
                    <Box className={isDarkMode ? 'dark' : 'light'}>
                        <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: .75 }}>
                            <Button
                                ref={cancelButton}
                                onClick={onCancel}
                                disabled={loading || pending}
                                startIcon={<RefreshIcon sx={{ transform: 'scale(-1, 1)' }} />}
                                sx={{
                                    gap: .5,
                                    [`& .${buttonClasses.startIcon}, & .${buttonClasses.endIcon}`]: {
                                        m: 0
                                    }
                                }}
                            >
                                {translations.discard_changes}
                                <Key>r c</Key>
                            </Button>
                            <LoadingButton
                                ref={saveButton}
                                onClick={handleSaveButtonClick}
                                loading={loading || pending}
                                loadingPosition="start"
                                variant="contained"
                                startIcon={<SaveIcon />}
                            >
                                {translations.save}
                                <Key sx={{ ml: 1, mr: -.5 }}>s</Key>
                            </LoadingButton>
                        </Box>
                    </Box>
                }
                sx={(theme) => ({
                    zIndex: theme.zIndex.snackbar - 101,
                    [`& .${snackbarContentClasses.root}`]: {
                        ...borderAndBoxShadow(theme)
                    }
                })}
            />
        </Box>
    );
};
