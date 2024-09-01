'use client';

import { appearanceAtom } from '@/states/appearance';
import data from '@emoji-mart/data/sets/14/twitter.json';
import EmojiPicker from '@emoji-mart/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Popover } from '@lunaproject/web-core/dist/components/Popover';
import { PopoverProps } from '@mui/material';
import { useAtomValue } from 'jotai';
import { $getSelection } from 'lexical';
import React, { useCallback } from 'react';

interface Props {
    open: boolean;
    anchorEl: Element | null;
    onClose: PopoverProps['onClose'];
}

export const Picker = ({ open, anchorEl, onClose }: Props) => {
    const { isDarkMode } = useAtomValue(appearanceAtom);

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
                theme={isDarkMode ? 'dark' : 'light'}
                style={{ border: 'none' }}
            />
        </Popover>
    );
};
