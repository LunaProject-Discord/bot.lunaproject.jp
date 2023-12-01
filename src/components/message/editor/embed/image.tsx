'use client';

import { LocalizationProps } from '@interfaces/localization';
import type { EmbedImage } from '@lunaproject/web-discord/dist/interfaces/message';
import { OutlinedInput } from '@mui/material';
import { ItemDisabledProps, ItemVariableProps } from '../../../items';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

type Props = ItemDisabledProps & ItemVariableProps<EmbedImage> & LocalizationProps;

export const EmbedImageEditor = ({ value, setValue, disabled, localization: { translations } }: Props) => (
    <EmbedAccordion>
        <EmbedAccordionSummary>{translations.embed_image}</EmbedAccordionSummary>
        <EmbedAccordionDetails>
            <EmbedFormContainer>
                <EmbedFormItem label={translations.embed_image_image_url}>
                    {(value.images.length > 0 ? value.images : ['']).map((image, i) => (
                        <OutlinedInput
                            key={i}
                            value={image}
                            onChange={(e) => {
                                const images = [...value.images];
                                images[i] = e.target.value;
                                setValue({ ...value, images });
                            }}
                            type="url"
                            disabled={disabled}
                            size="small"
                            margin="none"
                            fullWidth
                        />
                    ))}
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_image_thumbnail_url}>
                    <OutlinedInput
                        value={value.thumbnail}
                        onChange={(e) => setValue({ ...value, thumbnail: e.target.value })}
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
