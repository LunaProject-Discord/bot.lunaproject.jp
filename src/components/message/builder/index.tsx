'use client';

import { CancelButton } from '@components/buttons';
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@components/dialog';
import { DarkModeIcon, DeleteIcon, EditIcon, LightModeIcon, PreviewIcon, SaveIcon } from '@components/icons';
import { Theme, ThemeProvider } from '@emotion/react';
import { LocalizationProps } from '@interfaces/localization';
import { DataMessage } from '@interfaces/message';
import { toDataMessage, toEmbed, toMessage } from '@libs/message';
import { segmentedControlClasses, THEMES } from '@lunaproject/web-core';
import { MessageContainer, MessagePreview } from '@lunaproject/web-core/dist/components/Message';
import { SegmentedControl } from '@lunaproject/web-core/dist/components/SegmentedControl';
import { Message } from '@lunaproject/web-discord/dist/interfaces';
import {
    Box,
    Button,
    DialogProps as MuiDialogProps,
    IconButton,
    Theme as MuiTheme,
    Tooltip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { GridTableRowsIcon, GridViewHeadlineIcon } from '@mui/x-data-grid';
import deepEqual from 'deep-equal';
import React, { Fragment, useEffect, useState } from 'react';
import { Editor } from '../editor';
import { MessagePreviewContainer } from '../preview';
import { MessageEditorContainer, MessageEditorSection, MessageEditorWrapper } from './components';

type ViewType = 'editor' | 'preview';

interface Props extends DialogProps, LocalizationProps {
    message: DataMessage;
    setMessage: (value: DataMessage | ((prevValue: DataMessage) => DataMessage)) => void;
}

export const MessageBuilder = ({ open, setOpen, message, setMessage, localization }: Props) => {
    const { translations } = localization;

    const theme = useTheme();
    const isMobile = useMediaQuery<MuiTheme>((theme) => theme.breakpoints.down('md'));

    const [lightTheme, setLightTheme] = useState(theme.palette.mode === 'light');
    const [compactMode, setCompactMode] = useState(false);

    const defaultTheme: Theme = {
        ...THEMES[lightTheme ? 'light' : 'dark'],
        appearance: {
            color: lightTheme ? 'light' : 'dark',
            display: !compactMode ? 'cozy' : 'compact',
            fontSize: 16
        }
    };

    const [viewType, setViewType] = useState<ViewType>('editor');

    const [editableMessage, setEditableMessage] = useState<Message>(toMessage(message));
    const isChanged = !deepEqual(message, toDataMessage(editableMessage), { strict: true });

    const handleClose = () => setOpen(false);

    const handleDialogClose: MuiDialogProps['onClose'] = (_, reason) => {
        if (reason === 'backdropClick' && isChanged) return;
        handleClose();
    };

    const handleSaveButtonClick = () => {
        setMessage(toDataMessage(editableMessage));
        handleClose();
    };

    const handleResetButtonClick = () => {
        setEditableMessage((msg) => ({
            ...msg,
            content: '',
            embeds: []
        }));
    };

    useEffect(() => {
        setEditableMessage((msg) => ({
            ...msg,
            content: message?.content ?? '',
            embeds: (message?.embeds ?? []).map((embed) => toEmbed(embed))
        }));
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            disableEscapeKeyDown={isChanged}
            fullScreen={isMobile}
            fullWidth
            maxWidth="xl"
            PaperProps={{
                sx: {
                    height: '100%'
                }
            }}
        >
            <DialogTitle>
                {translations.message_builder}
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip
                        title={!lightTheme ? translations.message_builder_light_theme : translations.message_builder_dark_theme}
                        placement="bottom"
                    >
                        <IconButton onClick={() => setLightTheme((prevState) => !prevState)}>
                            {!lightTheme ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title={!compactMode ? translations.message_builder_compact_mode : translations.message_builder_cozy_mode}
                        placement="bottom"
                    >
                        <IconButton onClick={() => setCompactMode((prevState) => !prevState)}>
                            {!compactMode ? <GridViewHeadlineIcon /> : <GridTableRowsIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ overflow: 'hidden' }}>
                <MessageEditorContainer sx={{ overflow: 'hidden' }}>
                    <Box
                        sx={{
                            pb: 3,
                            display: { xs: 'block', md: 'none' },
                            [`& .${segmentedControlClasses.button}`]: {
                                width: '100%'
                            }
                        }}
                    >
                        <SegmentedControl<ViewType>
                            value={viewType}
                            setValue={setViewType}
                            choices={[
                                {
                                    value: 'editor',
                                    children: <Fragment>
                                        <EditIcon sx={{ ml: -.75 }} />
                                        {translations.message_builder_editor}
                                    </Fragment>
                                },
                                {
                                    value: 'preview',
                                    children: <Fragment>
                                        <PreviewIcon sx={{ ml: -.75 }} />
                                        {translations.message_builder_preview}
                                    </Fragment>
                                }
                            ]}
                        />
                    </Box>
                    <ThemeProvider theme={defaultTheme}>
                        <MessageEditorWrapper>
                            <MessageEditorSection active={viewType === 'editor'}>
                                <Editor
                                    value={editableMessage}
                                    setValue={setEditableMessage}
                                    localization={localization}
                                />
                            </MessageEditorSection>
                            <MessageEditorSection active={viewType === 'preview'}>
                                <MessagePreviewContainer sx={{ height: '100%' }}>
                                    <MessageContainer style={{ border: `solid 1px ${theme.palette.divider}` }}>
                                        <MessagePreview message={editableMessage} />
                                    </MessageContainer>
                                </MessagePreviewContainer>
                            </MessageEditorSection>
                        </MessageEditorWrapper>
                    </ThemeProvider>
                </MessageEditorContainer>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleResetButtonClick}
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ mr: 'auto' }}
                >
                    {translations.reset}
                </Button>
                {isChanged ? <Fragment>
                    <CancelButton onClick={handleClose}>
                        {translations.cancel}
                    </CancelButton>
                    <Button onClick={handleSaveButtonClick} variant="contained" startIcon={<SaveIcon />}>
                        {translations.save}
                    </Button>
                </Fragment> : <CancelButton onClick={handleClose} variant="contained">
                    {translations.close}
                </CancelButton>}
            </DialogActions>
        </Dialog>
    );
};
