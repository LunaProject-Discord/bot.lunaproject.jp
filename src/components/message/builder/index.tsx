'use client';

import { Theme, ThemeProvider } from '@emotion/react';
import { LocalizationProps } from '@interfaces/localization';
import { DataMessage } from '@interfaces/message';
import { toDataMessage, toEmbed, toMessage } from '@libs/message';
import { Preview, THEMES } from '@lunaproject-discord/web-core';
import { DialogProps } from '@lunaproject-discord/web-core/dist/components/Dialog';
import { Message } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { CloseOutlined, DeleteOutlined, EditOutlined, PreviewOutlined, SaveOutlined } from '@mui/icons-material';
import { AppBar, Box, Button, Dialog, Divider, Tab, Tabs, Toolbar, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Editor } from '../editor';
import { MessagePreviewContainer } from '../preview';
import { MessageEditorContainer, MessageEditorSection, MessageEditorWrapper } from './styles';

interface Props extends DialogProps, LocalizationProps {
    message: DataMessage;
    setMessage: (value: DataMessage | ((prevValue: DataMessage) => DataMessage)) => void;
}

export const MessageBuilder = ({ open, onClose, message, setMessage, localization }: Props) => {
    const { translations } = localization;

    const theme = useTheme();

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

    const [tabState, setTabState] = useState<'editor' | 'preview'>('editor');

    const [editableMessage, setEditableMessage] = useState<Message>(toMessage(message));

    useEffect(() => {
        setEditableMessage((msg) => ({
            ...msg,
            content: message?.content ?? '',
            embeds: (message?.embeds ?? []).map((embed) => toEmbed(embed))
        }));
    }, [open]);

    const handleResetClick = () => {
        setEditableMessage((msg) => ({
            ...msg,
            content: '',
            embeds: []
        }));
    };

    const handleSaveClick = () => {
        setMessage(toDataMessage(editableMessage));
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableEscapeKeyDown
            fullScreen
            sx={{
                zIndex: (theme) => theme.zIndex.modal + 100,
                '& .MuiPaper-root': {
                    overflow: 'hidden'
                }
            }}
        >
            <AppBar color="default" elevation={0} sx={{ p: '0px !important' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                        {translations.message_builder}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button onClick={handleResetClick} color="error" startIcon={<DeleteOutlined />}>
                            {translations.reset}
                        </Button>
                        <Divider orientation="vertical" flexItem sx={{ m: 1 }} />
                        <Button onClick={onClose} startIcon={<CloseOutlined />}>
                            {translations.cancel}
                        </Button>
                        <Button onClick={handleSaveClick} variant="contained" startIcon={<SaveOutlined />}>
                            {translations.save}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <MessageEditorContainer>
                <Toolbar />
                <Box sx={{ display: { xs: 'block', md: 'none' }, borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabState} onChange={(_, value) => setTabState(value)} variant="fullWidth">
                        <Tab
                            value="editor"
                            icon={<EditOutlined />}
                            iconPosition="start"
                            label="エディター"
                            sx={{
                                minHeight: 0,
                                px: 2,
                                py: 1.5
                            }}
                        />
                        <Tab
                            value="preview"
                            icon={<PreviewOutlined />}
                            iconPosition="start"
                            label="プレビュー"
                            sx={{
                                minHeight: 0,
                                px: 2,
                                py: 1.5
                            }}
                        />
                    </Tabs>
                </Box>
                <ThemeProvider theme={defaultTheme}>
                    <MessageEditorWrapper>
                        <MessageEditorSection active={tabState === 'editor'}>
                            <Editor
                                message={editableMessage}
                                setMessage={setEditableMessage}
                                localization={localization}
                            />
                        </MessageEditorSection>
                        <MessageEditorSection active={tabState === 'preview'}>
                            <MessagePreviewContainer>
                                <Preview message={editableMessage} />
                            </MessagePreviewContainer>
                        </MessageEditorSection>
                    </MessageEditorWrapper>
                </ThemeProvider>
            </MessageEditorContainer>
        </Dialog>
    );
};
