'use client';

import type { EmbedImage } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { OutlinedInput } from '@mui/material';
import { LocalizationProps } from '../../../../interfaces/localization';
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
                            fullWidth
                            size="small"
                            margin="none"
                        />
                    ))}
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_image_thumbnail_url}>
                    <OutlinedInput
                        value={value.thumbnail}
                        onChange={(e) => setValue({ ...value, thumbnail: e.target.value })}
                        type="url"
                        disabled={disabled}
                        fullWidth
                        size="small"
                        margin="none"
                    />
                </EmbedFormItem>
            </EmbedFormContainer>
        </EmbedAccordionDetails>
    </EmbedAccordion>
);
