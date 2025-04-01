'use client';

import { CancelButton } from '@/components/buttons';
import { DarkModeIcon, DeleteIcon, EditIcon, LightModeIcon, PreviewIcon, SaveIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { MessageData } from '@/interfaces/message';
import { toLPDMessage } from '@/libs/message';
import { appearanceAtom } from '@/states/appearance';
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
import { Message, Messages, messagesClasses } from '@lunaproject/web-discord-components';
import { Box, DialogProps as MuiDialogProps, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { GridTableRowsIcon, GridViewHeadlineIcon } from '@mui/x-data-grid';
import deepEqual from 'deep-equal';
import { useAtomValue } from 'jotai';
import React, { Fragment, useEffect, useState } from 'react';
import { MessageEditor } from '../editor';
import { MessagePreviewContainer } from '../preview';
import { MessageBuilderActionType, useMessageBuilder } from '../utils';
import { MessageEditorContainer, MessageEditorSection, MessageEditorWrapper } from './components';

type ViewType = 'editor' | 'preview';

export type MessageBuilderProps = ModalProps & SectionCardVariableProps<{ value: MessageData; }> & LocalizationProps;

export const MessageBuilder = ({ open, setOpen, value, setValue, localization }: MessageBuilderProps) => {
    const { translations } = localization;

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const { isDarkMode } = useAtomValue(appearanceAtom);

    const [lightTheme, setLightTheme] = useState(!isDarkMode);
    const [compactMode, setCompactMode] = useState(false);

    const [viewType, setViewType] = useState<ViewType>('editor');

    const [message, dispatch] = useMessageBuilder(value);
    const isChanged = !deepEqual(value, message, { strict: true });

    const handleClose = () => setOpen(false);

    const handleDialogClose: MuiDialogProps['onClose'] = (_, reason) => {
        if (reason === 'backdropClick' && isChanged)
            return;

        handleClose();
    };

    const handleSaveButtonClick = () => {
        setValue(message);
        handleClose();
    };

    const handleResetButtonClick = () => dispatch({ type: MessageBuilderActionType.Clear });

    useEffect(() => {
        if (open)
            setLightTheme(!isDarkMode);

        dispatch({ type: MessageBuilderActionType.SetContent, value: value?.content ?? '' });
        dispatch({ type: MessageBuilderActionType.SetEmbeds, value: value?.embeds ?? [] });
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
                    <MessageEditorWrapper>
                        <MessageEditorSection active={viewType === 'editor'}>
                            <MessageEditor
                                message={message}
                                dispatch={dispatch}
                                localization={localization}
                            />
                        </MessageEditorSection>
                        <MessageEditorSection active={viewType === 'preview'}>
                            <MessagePreviewContainer
                                sx={{
                                    border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                                    [`&, & .${messagesClasses.root}`]: {
                                        borderRadius: 1
                                    }
                                }}
                            >
                                <Messages
                                    appearance={{
                                        color: !lightTheme ? 'dark' : 'light',
                                        display: !compactMode ? 'cozy' : 'compact'
                                    }}
                                >
                                    <Message message={toLPDMessage(message)} />
                                </Messages>
                            </MessagePreviewContainer>
                        </MessageEditorSection>
                    </MessageEditorWrapper>
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
