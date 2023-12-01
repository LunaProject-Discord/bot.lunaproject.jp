'use client';

import data from '@emoji-mart/data/sets/14/twitter.json';
import EmojiPicker from '@emoji-mart/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Popover } from '@lunaproject/web-core';
import { PopoverProps, useTheme } from '@mui/material';
import { $getSelection } from 'lexical';
import React, { useCallback } from 'react';

interface Props {
    open: boolean;
    anchorEl: Element | null;
    onClose: PopoverProps['onClose'];
}

export const Picker = ({ open, anchorEl, onClose }: Props) => {
    const theme = useTheme();

    const [editor] = useLexicalComposerContext();

    const insertText = useCallback((value: string) => {
        editor.update(() => {
            const selection = $getSelection();
            selection?.insertText(value);
        });
    }, [editor]);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ zIndex: 1600 }}
        >
            <EmojiPicker
                onEmojiSelect={(e: any) => insertText(e.native)}
                data={data}
                set="twitter"
                skinTonePosition="search"
                locale="ja"
                theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
                style={{ border: 'none' }}
            />
        </Popover>
    );
};
