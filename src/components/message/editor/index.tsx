'use client';

import { ItemDisabledProps, ItemVariableProps } from '@/components/items';
import { LocalizationProps } from '@/interfaces/localization';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Message } from '@lunaproject/web-discord/dist/interfaces';
import { Box, Divider } from '@mui/material';
import React from 'react';
import { TextArea } from '../text_area';
import { EmbedsEditor } from './embed';

type Props = ItemDisabledProps & ItemVariableProps<Message> & LocalizationProps;

export const Editor = ({ value, setValue, disabled, localization }: Props) => (
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
