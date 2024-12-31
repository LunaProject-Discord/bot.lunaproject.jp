'use client';

import { editorClasses, editorDefaultExtensions, EditorRoot } from '@/components/editor';
import { GuildWebPage } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { Box, Divider, Grid2 as Grid, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import {
    getHierarchicalIndexes,
    TableOfContentDataItem,
    TableOfContents
} from '@tiptap-pro/extension-table-of-contents';
import { TextSelection } from '@tiptap/pm/state';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import React, { useCallback, useMemo, useState } from 'react';

interface ViewProps extends GuildViewProps {
    page: GuildWebPage;
}

export const View = ({ guild, page, localization }: ViewProps) => {
    const pageContent = useMemo(() => {
        const contents = page.contents.toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1);
        return contents[0];

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const pageContentTitle = pageContent?.title;
    const pageContentContent: JSONContent = pageContent?.content ? JSON.parse(pageContent.content) : {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                attrs: {
                    textAlign: 'left'
                }
            }
        ]
    };

    const [tableOfContents, setTableOfContents] = useState<TableOfContentDataItem[]>([]);

    const editor = useEditor({
        content: pageContentContent,
        extensions: [
            ...editorDefaultExtensions,
            TableOfContents.configure({
                getId: (textContent) => encodeURIComponent(textContent),
                getIndex: getHierarchicalIndexes,
                onUpdate: (tableOfContents) => setTableOfContents(tableOfContents)
            })
        ],
        editable: false,
        editorProps: {
            attributes: {
                class: editorClasses.content
            }
        }
    });

    const handleTableOfContentsItemButtonClick = useCallback((id: string) => () => {
        if (!editor)
            return;

        const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
        if (!element)
            return;

        const position = editor.view.posAtDOM(element, 0);

        const transaction = editor.view.state.tr;
        transaction.setSelection(new TextSelection(transaction.doc.resolve(position)));
        editor.view.dispatch(transaction);

        editor.view.focus();
        element.scrollIntoView({ behavior: 'smooth' });
    }, [editor]);

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, xl: 9 }}>
                <EditorRoot>
                    <Typography variant="h1" className={editorClasses.title}>{pageContentTitle}</Typography>
                    <EditorContent editor={editor} />
                </EditorRoot>
            </Grid>
            <Grid size={{ xs: 12, xl: 3 }}>
                <Box
                    sx={(theme) => ({
                        mt: -2,
                        pt: 2,
                        position: 'sticky',
                        top: { xs: theme.spacing(7 + 6), sm: theme.spacing(8 + 6) }
                    })}
                >
                    <Paper
                        variant="outlined"
                        elevation={0}
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        <Typography variant="h4" fontWeight={400}>目次</Typography>
                        <Divider flexItem sx={{ mb: 1 }} />
                        <List sx={{ mx: -1.5, my: -1, p: 0, overflowY: 'auto' }}>
                            {tableOfContents.map((item) => (
                                <ListItemButton
                                    key={item.id}
                                    onClick={handleTableOfContentsItemButtonClick(item.id)}
                                    sx={{
                                        pl: 1.5 + (item.level - 2),
                                        pr: 1.5,
                                        py: 1,
                                        borderRadius: 1
                                    }}
                                >
                                    <ListItemText primary={item.textContent} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
};
