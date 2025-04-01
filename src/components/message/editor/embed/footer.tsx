'use client';

import { MessageBuilderAction, MessageBuilderActionType } from '@/components/message';
import { LocalizationProps } from '@/interfaces/localization';
import { MessageEmbedFooter, MessageTimestampData } from '@/interfaces/message';
import { MessageEmbedFooterTextSchema } from '@/schemas/message';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { OutlinedInput } from '@mui/material';
import React from 'react';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

export interface EmbedFooterEditorProps extends SectionCardDisabledProps, LocalizationProps {
    embedIndex: number;
    footer: MessageEmbedFooter & { timestamp: MessageTimestampData | null };
    dispatch: (action: MessageBuilderAction) => void;
}

export const EmbedFooterEditor = (
    {
        embedIndex,
        footer: {
            text,
            icon_url,
            timestamp
        },
        dispatch,
        disabled,
        localization: { translations }
    }: EmbedFooterEditorProps
) => (
    <EmbedAccordion>
        <EmbedAccordionSummary>{translations.embed_footer}</EmbedAccordionSummary>
        <EmbedAccordionDetails>
            <EmbedFormContainer>
                <EmbedFormItem
                    label={translations.embed_footer_text}
                    length={text.length}
                    maxLength={MessageEmbedFooterTextSchema.maxLength!}
                >
                    <OutlinedInput
                        value={text}
                        onChange={(e) => dispatch({
                            type: MessageBuilderActionType.SetEmbedFooterText,
                            index: embedIndex,
                            value: e.target.value
                        })}
                        type="text"
                        inputProps={{ maxLength: MessageEmbedFooterTextSchema.maxLength }}
                        disabled={disabled}
                        size="small"
                        margin="none"
                        fullWidth
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_footer_icon_url} inline>
                    <OutlinedInput
                        value={icon_url}
                        onChange={(e) => dispatch({
                            type: MessageBuilderActionType.SetEmbedFooterIconUrl,
                            index: embedIndex,
                            value: e.target.value
                        })}
                        type="url"
                        disabled={disabled}
                        size="small"
                        margin="none"
                        fullWidth
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_footer_timestamp} inline sx={{ flexGrow: .5 }}>

                </EmbedFormItem>
            </EmbedFormContainer>
        </EmbedAccordionDetails>
    </EmbedAccordion>
);
