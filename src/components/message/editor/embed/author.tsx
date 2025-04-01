'use client';

import { MessageBuilderAction, MessageBuilderActionType } from '@/components/message';
import { LocalizationProps } from '@/interfaces/localization';
import { MessageEmbedAuthor } from '@/interfaces/message';
import { MessageEmbedAuthorNameSchema } from '@/schemas/message';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { OutlinedInput } from '@mui/material';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

export interface EmbedAuthorEditorProps extends SectionCardDisabledProps, LocalizationProps {
    embedIndex: number;
    author: MessageEmbedAuthor;
    dispatch: (action: MessageBuilderAction) => void;
}

export const EmbedAuthorEditor = (
    {
        embedIndex,
        author: {
            name,
            url,
            icon_url
        },
        dispatch,
        disabled,
        localization: { translations }
    }: EmbedAuthorEditorProps
) => (
    <EmbedAccordion>
        <EmbedAccordionSummary>{translations.embed_author}</EmbedAccordionSummary>
        <EmbedAccordionDetails>
            <EmbedFormContainer>
                <EmbedFormItem
                    label={translations.embed_author_name}
                    length={name.length}
                    maxLength={MessageEmbedAuthorNameSchema.maxLength!}
                >
                    <OutlinedInput
                        value={name}
                        onChange={(e) => dispatch({
                            type: MessageBuilderActionType.SetEmbedAuthorName,
                            index: embedIndex,
                            value: e.target.value
                        })}
                        type="text"
                        inputProps={{ maxLength: MessageEmbedAuthorNameSchema.maxLength }}
                        disabled={disabled}
                        size="small"
                        margin="none"
                        fullWidth
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_author_url} inline>
                    <OutlinedInput
                        value={url}
                        onChange={(e) => dispatch({
                            type: MessageBuilderActionType.SetEmbedAuthorUrl,
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
                <EmbedFormItem label={translations.embed_author_icon_url} inline>
                    <OutlinedInput
                        value={icon_url}
                        onChange={(e) => dispatch({
                            type: MessageBuilderActionType.SetEmbedAuthorIconUrl,
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
            </EmbedFormContainer>
        </EmbedAccordionDetails>
    </EmbedAccordion>
);
