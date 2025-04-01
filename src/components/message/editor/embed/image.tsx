'use client';

import { MessageBuilderAction, MessageBuilderActionType } from '@/components/message';
import { LocalizationProps } from '@/interfaces/localization';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { OutlinedInput } from '@mui/material';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

export interface MessageEmbedImage {
    image: string;
    thumbnail: string;
}

export interface EmbedImageEditorProps extends SectionCardDisabledProps, LocalizationProps {
    embedIndex: number;
    image: MessageEmbedImage;
    dispatch: (action: MessageBuilderAction) => void;
}

export const EmbedImageEditor = (
    {
        embedIndex,
        image: {
            image,
            thumbnail
        },
        dispatch,
        disabled,
        localization: { translations }
    }: EmbedImageEditorProps
) => (
    <EmbedAccordion>
        <EmbedAccordionSummary>{translations.embed_image}</EmbedAccordionSummary>
        <EmbedAccordionDetails>
            <EmbedFormContainer>
                <EmbedFormItem label={translations.embed_image_image_url}>
                    <OutlinedInput
                        value={image}
                        onChange={(e) => dispatch({
                            type: MessageBuilderActionType.SetEmbedImage,
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
                <EmbedFormItem label={translations.embed_image_thumbnail_url}>
                    <OutlinedInput
                        value={thumbnail}
                        onChange={(e) => dispatch({
                            type: MessageBuilderActionType.SetEmbedThumbnail,
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
