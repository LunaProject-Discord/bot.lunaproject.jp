import React from 'react';
import { formatTimestamp } from '../../../utils/date';

export interface Props {
    timestamp: Date;
}

export const EmbedTimestamp = ({ timestamp }: Props) => (<span>{formatTimestamp(timestamp)}</span>);
