'use client';

import data from '@emoji-mart/data/sets/14/twitter.json';
import EmojiPicker from '@emoji-mart/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Popover as MuiPopover, PopoverProps, styled } from '@mui/material';
import { $getSelection } from 'lexical';
import React, { useCallback } from 'react';

const Popover = styled(MuiPopover)(({ theme }) => ({
    '& .MuiPaper-root': {
        border: `solid 1px ${theme.palette.divider}`,
        boxShadow: `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
    }
}));

interface Props {
    open: boolean;
    anchorEl: Element | null;
    onClose: PopoverProps['onClose'];
}

export const Picker = ({ open, anchorEl, onClose }: Props) => {
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
                style={{ border: 'none', borderRadius: 4 }}
            />
        </Popover>
    );
};
