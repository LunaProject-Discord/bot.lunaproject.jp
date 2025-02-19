'use client';

import { CancelButton } from '@/components/buttons';
import { DarkModeIcon, DeleteIcon, EditIcon, LightModeIcon, PreviewIcon, SaveIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { DataEmbed, DataMessage } from '@/interfaces/message';
import { toDataMessage, toEmbed, toMessage } from '@/libs/message';
import { toLPDMessage } from '@/libs/message_v2';
import { appearanceAtom } from '@/states/appearance';
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
import { Message, Messages, messagesClasses } from '@lunaproject/web-discord-components';
import { buildDiscordTheme } from '@lunaproject/web-discord/dist/styles';
import { Box, DialogProps as MuiDialogProps, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { GridTableRowsIcon, GridViewHeadlineIcon } from '@mui/x-data-grid';
import deepEqual from 'deep-equal';
import { useAtomValue } from 'jotai';
import React, { Fragment, useEffect, useState } from 'react';
import { MessageEditor } from '../editor';
import { MessagePreviewContainer } from '../preview';
import { MessageEditorContainer, MessageEditorSection, MessageEditorWrapper } from './components';

type ViewType = 'editor' | 'preview';

export type MessageBuilderProps = ModalProps & SectionCardVariableProps<{ value: DataMessage; }> & LocalizationProps;

export const MessageBuilder = ({ open, setOpen, value, setValue, localization }: MessageBuilderProps) => {
    const { translations } = localization;

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const { isDarkMode } = useAtomValue(appearanceAtom);

    const [lightTheme, setLightTheme] = useState(!isDarkMode);
    const [compactMode, setCompactMode] = useState(false);

    const defaultTheme = buildDiscordTheme({
        color: lightTheme ? 'light' : 'dark',
        display: !compactMode ? 'cozy' : 'compact'
    });

    const [viewType, setViewType] = useState<ViewType>('editor');

    const [editableMessage, setEditableMessage] = useState(toMessage(value));
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
        if (open)
            setLightTheme(!isDarkMode);

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
                                        <Message
                                            message={
                                                toLPDMessage({
                                                    content: editableMessage.content,
                                                    embeds: editableMessage.embeds.map((embed): DataEmbed => ({
                                                        title: embed.title ?? '',
                                                        description: embed.description ?? '',
                                                        url: embed.url ?? null,
                                                        color: embed.color.hex(),
                                                        timestamp: embed.timestamp?.getTime()?.toString() ?? null,
                                                        author: embed.author?.name ? {
                                                            name: embed.author.name,
                                                            url: embed.author.url ?? null,
                                                            iconUrl: embed.author.iconUrl ?? null
                                                        } : null,
                                                        footer: embed.footer?.text ? {
                                                            text: embed.footer.text,
                                                            iconUrl: embed.footer.iconUrl ?? null
                                                        } : null,
                                                        fields: (embed.fields ?? []).map((field) => ({
                                                            name: field.name,
                                                            value: field.value,
                                                            inline: field.inline ?? null
                                                        })),
                                                        image: (embed.image.images.length > 0 || embed.image.thumbnail.length > 0) ? {
                                                            images: embed.image.images.length > 0 ? embed.image.images.filter((image) => image.length > 0) : [],
                                                            thumbnail: embed.image.thumbnail ?? null
                                                        } : null
                                                    }))
                                                })
                                            }
                                        />
                                    </Messages>
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
