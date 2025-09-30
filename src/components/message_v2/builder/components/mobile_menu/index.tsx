'use client';

import { CloseIcon, RedoIcon, SaveIcon, UndoIcon } from '@/components/icons';
import { MessageBuilderMenuProps } from '@/components/message_v2';
import { BottomSheet, BottomSheetContent } from '@lunaproject/web-core/dist/components/BottomSheet';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import {
    PickerItem,
    PickerItemIcon,
    PickerItemText,
    useMobilePickerRef
} from '@lunaproject/web-core/dist/components/Picker';
import { SelectPickerChoiceGroupSubheader } from '@lunaproject/web-core/dist/components/Select';
import { getEditorPredicate, RibbonAccessKeyTip, ribbonTabClasses, useRibbonTabContext } from '@lunaproject/web-editor';
import {
    Box,
    Divider,
    IconButton,
    List,
    listSubheaderClasses,
    Tab,
    tabClasses,
    Tabs,
    tabsClasses,
    Tooltip
} from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import clsx from 'clsx';
import React, { createElement } from 'react';
import { Virtualizer } from 'virtua';

export const MessageBuilderMobileMenu = (
    {
        openBottomSheet,
        onSaveButtonClick,
        onCancelButtonClick,
        localization
    }: MessageBuilderMenuProps
) => {
    const { translations } = localization;

    const { editor } = useCurrentEditor();

    const { tab, tabs, name, setName } = useRibbonTabContext();

    const { sheetScrollRef, setSheetContentRef } = useMobilePickerRef();

    if (!editor)
        return null;

    return (
        <BottomSheet
            open={openBottomSheet}
            blocking={false}
            defaultSnap={({ headerHeight }) => headerHeight}
            snapPoints={({ maxHeight, headerHeight }) => [maxHeight - 8 * 9, maxHeight / 2, headerHeight]}
            initialFocusRef={false}
            header={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={translations.undo} placement="bottom">
                            <IconButton
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.isInitialized || editor.isDestroyed || !editor.can().undo()}
                            >
                                <UndoIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.redo} placement="bottom">
                            <IconButton
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.isInitialized || editor.isDestroyed || !editor.can().redo()}
                            >
                                <RedoIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            onClick={onCancelButtonClick}
                            variant="outlined"
                            corners="extended"
                            startIcon={<CloseIcon />}
                        >
                            {translations.cancel}
                        </Button>
                        <Button
                            onClick={onSaveButtonClick}
                            disableElevation
                            variant="contained"
                            corners="extended"
                            startIcon={<SaveIcon />}
                        >
                            {translations.save}
                        </Button>
                    </Box>
                </Box>
            }
            sx={{
                '& [data-rsbs-scroll]': {
                    overflow: 'auto',
                    '& [data-rsbs-content]': {
                        overflow: 'unset'
                    }
                }
            }}
        >
            <BottomSheetContent ref={setSheetContentRef} sx={{ height: '100%', p: 0, gap: 0 }}>
                <Box
                    sx={(theme) => ({
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        borderTop: `solid 1px ${theme.vars.palette.divider}`,
                        ...theme.applyStyles('dark', {
                            backgroundImage: theme.vars.overlays[8]
                        }),
                        [`& .${tabsClasses.flexContainer}`]: {
                            gap: 0
                        },
                        [`& .${tabClasses.root}`]: {
                            minWidth: 0,
                            minHeight: theme.spacing(7),
                            px: 2
                        }
                    })}
                >
                    <Tabs
                        value={name}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ border: 'none' }}
                    >
                        {tabs.map((tab) => {
                            const isVisible = getEditorPredicate(tab.visible, editor, true);
                            if (!isVisible)
                                return null;

                            return (
                                <Tab
                                    key={tab.name}
                                    value={tab.name}
                                    onClick={() => setName(tab.name)}
                                    label={
                                        <RibbonAccessKeyTip accessKey={tab.accessKey}>
                                            {tab.label}
                                        </RibbonAccessKeyTip>
                                    }
                                    className={
                                        clsx(
                                            ribbonTabClasses.root,
                                            name === tab.name && ribbonTabClasses.active
                                        )
                                    }
                                />
                            );
                        })}
                    </Tabs>
                </Box>
                {tab && <Virtualizer scrollRef={sheetScrollRef} overscan={2}>
                    {tab.content.map((tabItem, i) => {
                        switch (tabItem.type) {
                            case 'divider':
                                return (<Divider key={`divider-${i}`} />);

                            case 'ribbonGroup':
                            default:
                                return (
                                    <List
                                        key={tabItem.name}
                                        sx={{
                                            [`&:has(.${listSubheaderClasses.root})`]: {
                                                pt: 0
                                            }
                                        }}
                                    >
                                        {tabItem.label && <SelectPickerChoiceGroupSubheader
                                            sx={(theme) => ({
                                                position: 'sticky',
                                                top: theme.spacing(7.125),
                                                [theme.breakpoints.down('sm')]: {
                                                    pt: 1.5
                                                }
                                            })}
                                        >
                                            {tabItem.label}
                                        </SelectPickerChoiceGroupSubheader>}
                                        {tabItem.content.map((groupItem, v) => {
                                            switch (groupItem.type) {
                                                case 'divider':
                                                    return (<Divider key={`divider-${v}`} sx={{ my: 1 }} />);

                                                case 'ribbonDropdownButton':
                                                    return null;

                                                case 'ribbonButton':
                                                default:
                                                    return (
                                                        <PickerItem
                                                            key={groupItem.name}
                                                            onClick={() => groupItem.perform({
                                                                editor,
                                                                view: editor.view,
                                                                state: editor.state
                                                            })}
                                                            disabled={getEditorPredicate(groupItem.disabled, editor)}
                                                            selected={getEditorPredicate(groupItem.selected, editor)}
                                                        >
                                                            {groupItem.icon && <PickerItemIcon>
                                                                {createElement(groupItem.icon)}
                                                            </PickerItemIcon>}
                                                            <PickerItemText
                                                                primary={groupItem.label ?? groupItem.tooltip?.children}
                                                            />
                                                        </PickerItem>
                                                    );
                                            }
                                        })}
                                    </List>
                                );
                        }
                    })}
                </Virtualizer>}
            </BottomSheetContent>
        </BottomSheet>
    );
};
