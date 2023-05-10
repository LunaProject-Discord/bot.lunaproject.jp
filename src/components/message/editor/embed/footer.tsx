'use client';

import type {
    Embed,
    EmbedFooter as OriginalEmbedFooter
} from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { OutlinedInput } from '@mui/material';
import React from 'react';
import { LocalizationProps } from '../../../../interfaces/localization';
import { DateTimeEditor } from '../../../date';
import { ItemDisabledProps, ItemVariableProps } from '../../../items';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

export type EmbedFooter = { timestamp: Embed['timestamp'] } & OriginalEmbedFooter;

type Props = ItemDisabledProps & ItemVariableProps<EmbedFooter> & LocalizationProps;

export const EmbedFooterEditor = ({ value, setValue, disabled, localization: { translations } }: Props) => (
    <EmbedAccordion>
        <EmbedAccordionSummary>{translations.embed_footer}</EmbedAccordionSummary>
        <EmbedAccordionDetails>
            <EmbedFormContainer>
                <EmbedFormItem label={translations.embed_footer_text} length={value.text.length} maxLength={2048}>
                    <OutlinedInput
                        value={value.text}
                        onChange={(e) => setValue({ ...value, text: e.target.value })}
                        type="text"
                        inputProps={{ maxLength: 2048 }}
                        disabled={disabled}
                        fullWidth
                        size="small"
                        margin="none"
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_footer_icon_url} inline>
                    <OutlinedInput
                        value={value.iconUrl}
                        onChange={(e) => setValue({ ...value, iconUrl: e.target.value })}
                        type="url"
                        disabled={disabled}
                        fullWidth
                        size="small"
                        margin="none"
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_footer_timestamp} inline sx={{ flexGrow: .5 }}>
                    <DateTimeEditor
                        value={value.timestamp}
                        setValue={(timestamp) => setValue({ ...value, timestamp })}
                    />
                </EmbedFormItem>
            </EmbedFormContainer>
        </EmbedAccordionDetails>
    </EmbedAccordion>
);
