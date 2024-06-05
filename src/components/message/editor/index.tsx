'use client';

import { LocalizationProps } from '@/interfaces/localization';
import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Message } from '@lunaproject/web-discord/dist/interfaces';
import { Box, Divider } from '@mui/material';
import React from 'react';
import { TextArea } from '../text_area';
import { EmbedsEditor } from './embed';

export type MessageEditorProps =
    SectionCardVariableProps<{ value: Message; }>
    & SectionCardDisabledProps
    & LocalizationProps;

export const MessageEditor = ({ value, setValue, disabled, localization }: MessageEditorProps) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextArea
            value={value.content}
            setValue={(content) => setValue((prevValue) => ({ ...prevValue, content }))}
            limit={2000}
            rows={8}
        />
        <Divider flexItem />
        <EmbedsEditor
            value={value.embeds}
            setValue={(action) => setValue((prevValue) => ({
                ...prevValue,
                embeds: getStateActionValue(action, prevValue.embeds)
            }))}
            localization={localization}
        />
    </Box>
);
