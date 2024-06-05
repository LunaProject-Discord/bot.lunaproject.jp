'use client';

import { CancelButton } from '@/components/buttons';
import { DarkModeIcon, DeleteIcon, EditIcon, LightModeIcon, PreviewIcon, SaveIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { DataMessage } from '@/interfaces/message';
import { toDataMessage, toEmbed, toMessage } from '@/libs/message';
import { ThemeProvider } from '@emotion/react';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ModalProps
} from '@lunaproject/web-core/dist/components/Dialog';
import { SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { SegmentedControl, segmentedControlClasses } from '@lunaproject/web-core/dist/components/SegmentedControl';
import { MessageContainer, MessagePreview } from '@lunaproject/web-discord/dist/components/Message';
import { Message } from '@lunaproject/web-discord/dist/interfaces';
import { buildDiscordTheme } from '@lunaproject/web-discord/dist/styles';
import { Box, DialogProps as MuiDialogProps, IconButton, Theme, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { GridTableRowsIcon, GridViewHeadlineIcon } from '@mui/x-data-grid';
import deepEqual from 'deep-equal';
import React, { Fragment, useEffect, useState } from 'react';
import { MessageEditor } from '../editor';
import { MessagePreviewContainer } from '../preview';
import { MessageEditorContainer, MessageEditorSection, MessageEditorWrapper } from './components';

type ViewType = 'editor' | 'preview';

export type MessageBuilderProps = ModalProps & SectionCardVariableProps<{ value: DataMessage; }> & LocalizationProps;

export const MessageBuilder = ({ open, setOpen, value, setValue, localization }: MessageBuilderProps) => {
    const { translations } = localization;

    const theme = useTheme();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [lightTheme, setLightTheme] = useState(theme.palette.mode === 'light');
    const [compactMode, setCompactMode] = useState(false);

    const defaultTheme = buildDiscordTheme({
        color: lightTheme ? 'light' : 'dark',
        display: !compactMode ? 'cozy' : 'compact'
    });

    const [viewType, setViewType] = useState<ViewType>('editor');

    const [editableMessage, setEditableMessage] = useState<Message>(toMessage(value));
    const isChanged = !deepEqual(value, toDataMessage(editableMessage), { strict: true });

    const handleClose = () => setOpen(false);

    const handleDialogClose: MuiDialogProps['onClose'] = (_, reason) => {
        if (reason === 'backdropClick' && isChanged) return;
        handleClose();
    };

    const handleSaveButtonClick = () => {
        setValue(toDataMessage(editableMessage));
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
            content: value?.content ?? '',
            embeds: (value?.embeds ?? []).map((embed) => toEmbed(embed))
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
                    <Box sx={{ pb: 3, display: { xs: 'block', md: 'none' } }}>
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
                            sx={{
                                p: .25,
                                borderRadius: 1.5,
                                [`& .${segmentedControlClasses.button}`]: {
                                    width: '100%'
                                }
                            }}
                        />
                    </Box>
                    <ThemeProvider theme={defaultTheme}>
                        <MessageEditorWrapper>
                            <MessageEditorSection active={viewType === 'editor'}>
                                <MessageEditor
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
                    variant="outlined"
                    corners="extended"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ mr: 'auto' }}
                >
                    {translations.reset}
                </Button>
                {isChanged ? <Fragment>
                    <CancelButton onClick={handleClose} variant="outlined" corners="extended">
                        {translations.cancel}
                    </CancelButton>
                    <Button
                        onClick={handleSaveButtonClick}
                        disableElevation
                        variant="contained"
                        corners="extended"
                        startIcon={<SaveIcon />}
                    >
                        {translations.save}
                    </Button>
                </Fragment> : <CancelButton onClick={handleClose} variant="outlined" corners="extended">
                    {translations.close}
                </CancelButton>}
            </DialogActions>
        </Dialog>
    );
};
