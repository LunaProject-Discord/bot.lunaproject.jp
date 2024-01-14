'use client';

import {
    BottomSheet,
    BottomSheetContent,
    BottomSheetHeaderToggleButton,
    defaultSnapPoints
} from '@components/bottom_sheet';
import { RefreshIcon, SaveIcon } from '@components/icons';
import { Changes } from '@components/save_confirm_v2/changes';
import { Change, ChangesGroupByPath } from '@components/save_confirm_v2/changes/utils';
import { Issues } from '@components/save_confirm_v2/issues';
import { LocalizationProps } from '@interfaces/localization';
import { LoadingButton } from '@mui/lab';
import { Box, IconButton, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { isRenderableReactNode } from '@utils/react/node';
import deepEqual from 'deep-equal';
import { diff } from 'json-diff-ts';
import Mousetrap from 'mousetrap';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import { SpringEvent } from 'react-spring-bottom-sheet/dist/types';
import { ZodType } from 'zod';

export const SheetMinHeight = 72;

export interface SaveConfirmV2Props<T> extends LocalizationProps {
    label?: ReactNode;
    source: T;
    target: T;
    schema: ZodType;
    groupByPath?: (changes: Change[] | undefined) => ChangesGroupByPath;
    keyMapping?: Record<string, string>;
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
        groupByPath,
        keyMapping,
        disableKeyboardShortcuts,
        onSave,
        onCancel,
        localization
    }: SaveConfirmV2Props<T>
) => {
    const { translations } = localization;

    const router = useRouter();

    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));

    const sheetRef = useRef<BottomSheetRef | null>(null);
    const saveButtonRef = useRef<HTMLButtonElement | null>(null);
    const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

    const parseResult = useMemo(() => schema.safeParse(target), [schema, target]);
    const diffResult = useMemo(() => diff(source, target), [source, target]);

    const sheetOpen = useMemo(() => !deepEqual(source, target, { strict: true }), [source, target]);
    const [sheetExpanded, setSheetExpanded] = useState(false);

    const [loading, setLoading] = useState(false);
    const [pending, startTransition] = useTransition();

    const handleSpringStart = ({ type }: SpringEvent) => {
        const sheet = sheetRef.current;
        if (!sheet)
            return;

        if (type !== 'SNAP')
            return;

        setTimeout(() => setSheetExpanded(sheet.height > SheetMinHeight));
    };

    const handleSpringEnd = ({ type }: SpringEvent) => {
        const sheet = sheetRef.current;
        if (!sheet)
            return;

        if (type !== 'SNAP')
            return;

        setSheetExpanded(sheet.height > SheetMinHeight);
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
            if (!sheetOpen || disableKeyboardShortcuts || loading || pending || !saveButton)
                return;

            saveButton.click();
        });
        Mousetrap.bind('r c', (e) => {
            e.preventDefault();

            const cancelButton = cancelButtonRef.current;
            if (!sheetOpen || disableKeyboardShortcuts || !cancelButton)
                return;

            cancelButton.click();
        });

        return () => {
            Mousetrap.unbind('s');
            Mousetrap.unbind('r c');
        };
    }, [sheetOpen, disableKeyboardShortcuts, loading, pending]);

    useEffect(() => {
        const sheet = sheetRef.current;
        if (!sheet)
            return;

        const expanded = sheet.height > SheetMinHeight;
        setSheetExpanded(() => expanded);

        const body = document.body;
        if (!body)
            return;

        body.style.overflow = !isSmall && expanded ? 'hidden' : '';
    }, [sheetRef.current?.height, isSmall]);

    return (
        <BottomSheet
            ref={sheetRef}
            open={sheetOpen}
            skipInitialTransition
            blocking={!isSmall && sheetExpanded}
            scrollLocking={!isSmall && sheetExpanded}
            onSpringStart={handleSpringStart}
            onSpringEnd={handleSpringEnd}
            expandOnContentDrag
            defaultSnap={({ headerHeight }) => headerHeight}
            snapPoints={defaultSnapPoints}
            header={
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BottomSheetHeaderToggleButton
                        expanded={sheetExpanded}
                        setExpanded={(open) => sheetRef.current?.snapTo(({ snapPoints }) => open ? Math.max(...snapPoints) : Math.min(...snapPoints))}
                        localization={localization}
                    />
                    {parseResult.success ? <Typography>
                        {isRenderableReactNode(label) ? label : translations.save_confirm}
                    </Typography> : <Box>
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
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={translations.discard_changes}>
                            <IconButton
                                ref={cancelButtonRef}
                                onClick={handleCancelButtonClick}
                                disabled={loading || pending}
                            >
                                <RefreshIcon sx={{ transform: 'scale(-1, 1)' }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.save}>
                            <LoadingButton
                                ref={saveButtonRef}
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
                </Box>
            }
            sx={{
                '& [data-rsbs-scroll]': {
                    overflow: 'auto'
                }
            }}
        >
            <BottomSheetContent>
                {!parseResult.success && <Issues issues={parseResult.error.issues} localization={localization} />}
                <Changes changes={diffResult} groupByPath={groupByPath} localization={localization} />
            </BottomSheetContent>
        </BottomSheet>
    );
};
