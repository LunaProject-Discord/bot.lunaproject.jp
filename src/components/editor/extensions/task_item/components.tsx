import { Checkbox } from '@mui/material';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

export const TaskItemNodeView = ({ editor, node, updateAttributes }: NodeViewProps) => {
    const checked: boolean = node.attrs.checked;

    return (
        <NodeViewWrapper {...node.attrs}>
            <Checkbox
                checked={checked}
                onChange={(e) => {
                    if (!editor.isEditable)
                        return;

                    updateAttributes({ checked: e.target.checked });
                }}
                disableRipple
            />
            <NodeViewContent />
        </NodeViewWrapper>
    );
};
