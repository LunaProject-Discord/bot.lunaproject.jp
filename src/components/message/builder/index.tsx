import { Theme, ThemeProvider } from '@emotion/react';
import { CloseOutlined, DeleteOutlined, EditOutlined, PreviewOutlined, SaveOutlined } from '@mui/icons-material';
import { AppBar, Box, Button, Dialog, Divider, Tab, Tabs, Toolbar, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { EditableMessage, SendableMessage } from '../../../interfaces/message';
import { useTranslation } from '../../../languages/client';
import { toEditableEmbed, toEditableMessage, toSendableMessage } from '../../../libs/message';
import { THEMES } from '../../../styles/discord/constants';
import { Editor } from '../editor';
import { Preview } from '../preview';
import { MessageEditorContainer, MessageEditorSection, MessageEditorWrapper } from './styles';

interface Props {
    message: SendableMessage;
    setMessage: (value: SendableMessage | ((prevValue: SendableMessage) => SendableMessage)) => void;

    open: boolean;
    onClose: () => void;
}

export const MessageBuilder = ({ message, setMessage, open, onClose }: Props) => {
    const translations = useTranslation();
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

    const [editableMessage, setEditableMessage] = useState<EditableMessage>(toEditableMessage(message));

    useEffect(() => {
        setEditableMessage((msg) => ({
            ...msg,
            content: message?.content ?? '',
            embeds: (message?.embeds ?? []).map((embed) => toEditableEmbed(embed))
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
        setMessage(toSendableMessage(editableMessage));
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableEscapeKeyDown
            fullScreen
            sx={{
                zIndex: 1500,
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
                            <Editor message={editableMessage} setMessage={setEditableMessage} />
                        </MessageEditorSection>
                        <MessageEditorSection active={tabState === 'preview'}>
                            <Preview message={editableMessage} />
                        </MessageEditorSection>
                    </MessageEditorWrapper>
                </ThemeProvider>
            </MessageEditorContainer>
        </Dialog>
    );
};
