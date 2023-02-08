import { $convertToMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ButtonBase } from '@lunaproject-discord/web-core';
import {
    EmojiEmotionsOutlined,
    FormatBoldOutlined,
    FormatItalicOutlined,
    FormatStrikethroughOutlined,
    FormatUnderlinedOutlined
} from '@mui/icons-material';
import { Box, styled, Typography } from '@mui/material';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { MouseEvent, useEffect, useState } from 'react';
import { TRANSFORMERS } from './lexical/transformers';

const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5),
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : '#121212',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius
}));

const Button = styled(ButtonBase)(({ theme }) => ({
    padding: theme.spacing(.5)
}));

interface Props {
    maxLength?: number;
    onPickerOpen: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Toolbar = ({ maxLength, onPickerOpen }: Props) => {
    const [editor] = useLexicalComposerContext();

    const [length, setLength] = useState(0);

    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [strikethrough, setStrikethrough] = useState(false);

    useEffect(() => {
        editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                setLength($convertToMarkdownString(TRANSFORMERS).length);

                const selection = $getSelection();

                if (!$isRangeSelection(selection)) return;

                setBold(selection.hasFormat('bold'));
                setItalic(selection.hasFormat('italic'));
                setUnderline(selection.hasFormat('underline'));
                setStrikethrough(selection.hasFormat('strikethrough'));
            });
        });
    }, [editor]);

    return (
        <Container>
            <Button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                <FormatBoldOutlined color={bold ? 'primary' : 'action'} />
            </Button>
            <Button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                <FormatItalicOutlined color={italic ? 'primary' : 'action'} />
            </Button>
            <Button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                <FormatUnderlinedOutlined color={underline ? 'primary' : 'action'} />
            </Button>
            <Button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                <FormatStrikethroughOutlined color={strikethrough ? 'primary' : 'action'} />
            </Button>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: .5 }}>
                <Typography variant="overline" sx={{ userSelect: 'none' }}>
                    {length}{maxLength && ` / ${maxLength}`}
                </Typography>
                <Button onClick={onPickerOpen} sx={{ ml: 'auto' }}>
                    <EmojiEmotionsOutlined color="action" />
                </Button>
            </Box>
        </Container>
    );
};
