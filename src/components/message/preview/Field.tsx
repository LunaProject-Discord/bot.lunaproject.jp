import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';
import { EditableEmbed, EditableEmbedField as Field } from '../../../interfaces/message';
import { getFieldGridColumn } from '../../../libs/message';
import { Markdown } from '../../../modules/markdown/Markdown';
import { MarkdownContainer } from '../../../modules/markdown/styles/MarkdownContainer';

const Container = styled('div')({
    minWidth: 0,
    fontSize: rem(14),
    lineHeight: rem(18)
});

const FieldName = styled('div')(({ theme }) => ({
    minWidth: 0,
    marginBottom: 1,
    fontSize: rem(14),
    fontWeight: 600,
    color: theme.header.primary
}));

const FieldValue = styled('div')(({ theme }) => ({
    minWidth: 0,
    [`& > ${MarkdownContainer}`]: {
        color: theme.text.normal,
        fontSize: rem(14),
        lineHeight: rem(18),
        whiteSpace: 'pre-line'
    }
}));

export interface Props {
    embed: EditableEmbed;
    field: Field;
}

export const EmbedField = ({ embed, field }: Props) => (
    <Container style={{ gridColumn: getFieldGridColumn(field, embed) }}>
        <FieldName>
            <Markdown content={field.name} type="embed-header" />
        </FieldName>
        <FieldValue>
            <Markdown content={field.value} type="embed-content" />
        </FieldValue>
    </Container>
);
