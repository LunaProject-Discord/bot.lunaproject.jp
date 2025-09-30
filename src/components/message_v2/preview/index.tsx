'use client';

import { MessageData } from '@/interfaces/message';
import { toLPDMessage } from '@/libs/message';
import { Appearance, Message, Messages, MessagesProps } from '@lunaproject/web-discord-components';
import { Box, BoxProps } from '@mui/material';
import '../../../../public/fonts/noto-sans-jp/style.css';
import '../../../../public/fonts/noto-sans/style.css';
import React from 'react';

export interface MessagePreviewProps extends Pick<BoxProps, 'className' | 'style' | 'sx'>, Omit<MessagesProps, 'appearance' | 'children'> {
    message: MessageData;
    appearance?: Partial<Appearance>;
}

export const MessagePreview = (
    {
        message,
        appearance,
        channels,
        roles,
        users,
        ...props
    }: MessagePreviewProps
) => {
    const color = appearance?.color ?? 'dark';
    const display = appearance?.display ?? 'cozy';

    return (
        <Box {...props}>
            <Messages appearance={{ color, display }} channels={channels} roles={roles} users={users}>
                <Message message={toLPDMessage(message)} />
            </Messages>
        </Box>
    );
};
