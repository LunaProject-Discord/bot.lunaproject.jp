'use client';

import { $convertFromMarkdownString } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Box, styled } from '@mui/material';
import { EditorState } from 'lexical';
import React, { Fragment, MouseEvent, useState } from 'react';
import { createMarkdownExport } from './lexical/converter';
import { MaxLengthPlugin } from './lexical/max_limit';
import { TRANSFORMERS } from './lexical/transformers';
import { Picker } from './picker';
import { Toolbar } from './toolbar';

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius
}));

const Editable = styled(ContentEditable)(({ theme }) => ({
    outline: 'none',
    '& p': {
        margin: 0
    },
    '& .format-bold': {
        fontWeight: 'bold'
    },
    '& .format-italic': {
        fontStyle: 'italic'
    },
    '& .format-underline': {
        textDecoration: 'underline'
    },
    '& .format-strikethrough': {
        textDecoration: 'line-through'
    },
    '& .format-underline.format-strikethrough': {
        textDecoration: 'underline line-through'
    }
}));

const Placeholder = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    color: theme.palette.text.secondary,
    pointerEvents: 'none',
    userSelect: 'none'
}));

interface Props {
    value: string;
    setValue: (value: string) => void;
    limit?: number;
    rows?: number;
    minRows?: number;
    maxRows?: number;
}


export const TextArea = ({ value, setValue, limit, rows, minRows, maxRows }: Props) => {
    const onChange = (editorState: EditorState) => {
        editorState.read(() => {
            const exportMarkdown = createMarkdownExport(TRANSFORMERS);
            setValue(exportMarkdown());
        });
    };

    const [pickerAnchorEl, setPickerAnchorEl] = useState<HTMLButtonElement | null>(null);
    const pickerOpen = Boolean(pickerAnchorEl);

    const handlePickerOpen = (e: MouseEvent<HTMLButtonElement>) => setPickerAnchorEl(e.currentTarget);
    const handlePickerClose = () => setPickerAnchorEl(null);

    return (
        <Fragment>
            <LexicalComposer
                initialConfig={{
                    namespace: 'TextArea',
                    onError: (error) => console.error(error),
                    editorState: () => $convertFromMarkdownString(value, TRANSFORMERS),
                    theme: {
                        text: {
                            bold: 'format-bold',
                            italic: 'format-italic',
                            underline: 'format-underline',
                            strikethrough: 'format-strikethrough'
                        }
                    }
                }}
            >
                <Container>
                    <Toolbar maxLength={limit} onPickerOpen={handlePickerOpen} />
                    <Box
                        sx={{
                            height: rows ? ((24 * rows) + (16 * 2)) : 'none',
                            minHeight: minRows ? ((24 * minRows) + (16 * 2)) : 'none',
                            maxHeight: maxRows ? ((24 * maxRows) + (16 * 2)) : 'none',
                            p: 2,
                            position: 'relative',
                            overflowY: 'auto'
                        }}
                    >
                        <RichTextPlugin
                            contentEditable={<Editable className="editable" />}
                            placeholder={<Placeholder>いまなにしてる？</Placeholder>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </Box>
                </Container>
                <OnChangePlugin onChange={onChange} />
                <HistoryPlugin />
                {limit ? <MaxLengthPlugin maxLength={limit} /> : <Fragment />}
                <Picker open={pickerOpen} anchorEl={pickerAnchorEl} onClose={handlePickerClose} />
            </LexicalComposer>
        </Fragment>
    );
};
