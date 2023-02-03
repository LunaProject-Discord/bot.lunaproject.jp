import React from 'react';
import { EditableMessage } from '../../../interfaces/message';
import { MessageContainer } from './MessageContainer';
import { MessagePreview } from './MessagePreview';

interface Props {
    message: EditableMessage;
}

export const Preview = ({ message }: Props) => (
    <MessageContainer style={{ border: 'none' }}>
        <MessagePreview message={message} />
    </MessageContainer>
);
