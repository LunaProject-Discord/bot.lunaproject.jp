'use client';

import { MessageBuilderAction, MessageBuilderActionType } from '@/components/message';
import { LocalizationProps } from '@/interfaces/localization';
import { MessageData } from '@/interfaces/message';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { Box, Divider } from '@mui/material';
import React from 'react';
import { TextArea } from '../text_area';
import { EmbedsEditor } from './embed';

export interface MessageEditorProps extends SectionCardDisabledProps, LocalizationProps {
    message: MessageData;
    dispatch: (action: MessageBuilderAction) => void;
}

export const MessageEditor = ({ message, dispatch, disabled, localization }: MessageEditorProps) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextArea
            value={message.content ?? ''}
            setValue={(value) => dispatch({ type: MessageBuilderActionType.SetContent, value: value })}
            limit={2000}
            rows={8}
        />
        <Divider flexItem />
        <EmbedsEditor
            embeds={message.embeds ?? []}
            dispatch={dispatch}
            localization={localization}
        />
    </Box>
);
