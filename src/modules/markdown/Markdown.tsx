import React, { memo } from 'react';
import { PARSERS } from './parsers/parsers';
import { MarkdownContainer } from './styles/MarkdownContainer';

export interface MarkdownProps {
    className?: string;
    content: string;
    type?: keyof typeof PARSERS;
}

const MarkdownRenderer = ({ className, content, type = 'default' }: MarkdownProps) => {
    const parse = PARSERS[type];

    return (
        <MarkdownContainer className={className}>
            {parse(content.trim())}
        </MarkdownContainer>
    );
};

export const Markdown = memo(MarkdownRenderer);
