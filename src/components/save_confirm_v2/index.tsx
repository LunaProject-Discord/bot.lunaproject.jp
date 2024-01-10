'use client';

import {
    BottomSheet,
    BottomSheetContent,
    BottomSheetHeaderToggleButton,
    defaultSnapPoints
} from '@components/bottom_sheet';
import { RefreshIcon, SaveIcon } from '@components/icons';
import { Changes } from '@components/save_confirm_v2/changes';
import { Issues } from '@components/save_confirm_v2/issues';
import { Key } from '@components/text';
import { LocalizationProps } from '@interfaces/localization';
import { LoadingButton } from '@mui/lab';
import { Box, Button, buttonClasses, IconButton, Tooltip, Typography } from '@mui/material';
import { isRenderableReactNode } from '@utils/react/node';
import deepEqual from 'deep-equal';
import { diff } from 'json-diff-ts';
import Mousetrap from 'mousetrap';
import { useRouter } from 'next/navigation';
import React, { Fragment, ReactNode, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types';
import { ZodType } from 'zod';

export interface SaveConfirmV2Props<T> extends LocalizationProps {
    label?: ReactNode;
    source: T;
    target: T;
    schema: ZodType;
    disableKeyboardShortcuts?: boolean;
    onSave: () => Promise<boolean>;
    onCancel: () => void;
}

export const SaveConfirmV2 = <T, >(
    {
        label,
        source,
        target,
        schema,
        disableKeyboardShortcuts,
        onSave,
        onCancel,
        localization
    }: SaveConfirmV2Props<T>
) => {
    const { translations } = localization;

    const router = useRouter();

    const sheetRef = useRef<BottomSheetRef | null>(null);
    const saveButtonRef = useRef<HTMLButtonElement | null>(null);
    const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

    const parseResult = useMemo(() => schema.safeParse(target), [schema, target]);
    const diffResult = useMemo(() => diff(source, target), [source, target]);

    const open = useMemo(() => !deepEqual(source, target, { strict: true }), [source, target]);
    const [expanded, setExpanded] = useState(false);

    const [loading, setLoading] = useState(false);
    const [pending, startTransition] = useTransition();

    const handleSpringStart = ({ type }: SpringEvent) => {
        const sheet = sheetRef.current;
        if (!sheet)
            return;

        if (type !== 'SNAP')
            return;

        setTimeout(() => setExpanded(sheet.height > 8 * 9));
    };

    const handleSpringEnd = ({ type }: SpringEvent) => {
        const sheet = sheetRef.current;
        if (!sheet)
            return;

        if (type !== 'SNAP')
            return;

        setExpanded(sheet.height > 8 * 9);
    };

    const handleSaveButtonClick = async () => {
        setLoading(true);

        const result = await onSave();
        if (result)
            startTransition(() => router.refresh());

        setLoading(false);
    };

    const handleCancelButtonClick = () => onCancel();

    useEffect(() => {
        Mousetrap.bind('s', (e) => {
            e.preventDefault();

            const saveButton = saveButtonRef.current;
            if (!open || disableKeyboardShortcuts || loading || pending || !saveButton)
                return;

            saveButton.click();
        });
        Mousetrap.bind('r c', (e) => {
            e.preventDefault();

            const cancelButton = cancelButtonRef.current;
            if (!open || disableKeyboardShortcuts || !cancelButton)
                return;

            cancelButton.click();
        });

        return () => {
            Mousetrap.unbind('s');
            Mousetrap.unbind('r c');
        };
    }, [open, disableKeyboardShortcuts, loading, pending]);

    return (
        <BottomSheet
            ref={sheetRef}
            open={open}
            skipInitialTransition
            blocking={false}
            scrollLocking={false}
            onSpringStart={handleSpringStart}
            onSpringEnd={handleSpringEnd}
            expandOnContentDrag
            defaultSnap={({ headerHeight }) => headerHeight}
            snapPoints={defaultSnapPoints}
            header={
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BottomSheetHeaderToggleButton
                        expanded={expanded}
                        setExpanded={(open) => sheetRef.current?.snapTo(({ snapPoints }) => open ? Math.max(...snapPoints) : Math.min(...snapPoints))}
                        localization={localization}
                    />
                    {parseResult.success ? <Fragment>
                        <Typography>{isRenderableReactNode(label) ? label : translations.save_confirm}</Typography>
                        <Box sx={{ ml: 'auto', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                            <Tooltip title={translations.discard_changes}>
                                <IconButton
                                    onClick={handleCancelButtonClick}
                                    disabled={loading || pending}
                                >
                                    <RefreshIcon sx={{ transform: 'scale(-1, 1)' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={translations.save}>
                                <LoadingButton
                                    onClick={handleSaveButtonClick}
                                    disabled={!parseResult.success}
                                    loading={loading || pending}
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        minWidth: 0,
                                        p: 1,
                                        borderRadius: '50%'
                                    }}
                                >
                                    <SaveIcon />
                                </LoadingButton>
                            </Tooltip>
                        </Box>
                    </Fragment> : <Box>
                        <Typography>
                            {String(translations.save_confirm_settings_error_cannot_save_alert_title).replace(
                                '%c',
                                parseResult.error.issues.length.toLocaleString()
                            )}
                        </Typography>
                        <Typography variant="body2" align="left" color="text.secondary">
                            {translations.save_confirm_settings_error_cannot_save_alert_description}
                        </Typography>
                    </Box>}
                </Box>
            }
            sx={{
                '& [data-rsbs-scroll]': {
                    overflow: 'auto'
                }
            }}
        >
            <BottomSheetContent>
                <Changes changes={diffResult} localization={localization} />
                {parseResult.success ? <Fragment>
                    <LoadingButton
                        ref={saveButtonRef}
                        onClick={handleSaveButtonClick}
                        disabled={!parseResult.success}
                        loading={loading || pending}
                        loadingPosition="start"
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                    >
                        {translations.save}
                        <Key sx={{ ml: 1, mr: -.5 }}>s</Key>
                    </LoadingButton>
                    <Button
                        ref={cancelButtonRef}
                        onClick={handleCancelButtonClick}
                        disabled={loading || pending}
                        size="large"
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
                </Fragment> : <Issues issues={parseResult.error.issues} localization={localization} />}
            </BottomSheetContent>
        </BottomSheet>
    );
};
