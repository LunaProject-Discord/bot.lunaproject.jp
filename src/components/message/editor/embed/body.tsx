'use client';

import { ColorField } from '@/components/field';
import { MessageBuilderAction, MessageBuilderActionType } from '@/components/message';
import { sectionColorFieldCardClasses } from '@/components/section_card';
import { LocalizationProps } from '@/interfaces/localization';
import { MessageEmbedDescriptionSchema, MessageEmbedTitleSchema } from '@/schemas/message';
import { useTheme } from '@emotion/react';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { decimalToRgb, rgbToDecimal } from '@lunaproject/web-discord-components';
import { OutlinedInput } from '@mui/material';
import { hsvaToRgba, rgbaToHsva } from '@uiw/react-color';
import React from 'react';
import { TextArea } from '../../text_area';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

export interface MessageEmbedBody {
    title: string;
    description: string;
    url: string;
    color: number | null;
}

export interface EmbedBodyEditorProps extends SectionCardDisabledProps, LocalizationProps {
    embedIndex: number;
    body: MessageEmbedBody;
    dispatch: (action: MessageBuilderAction) => void;
}

export const EmbedBodyEditor = (
    {
        embedIndex,
        body: {
            title,
            description,
            url,
            color
        },
        dispatch,
        disabled,
        localization
    }: EmbedBodyEditorProps
) => {
    const { translations } = localization;

    const theme = useTheme();

    return (
        <EmbedAccordion>
            <EmbedAccordionSummary>{translations.embed_body}</EmbedAccordionSummary>
            <EmbedAccordionDetails>
                <EmbedFormContainer>
                    <EmbedFormItem
                        label={translations.embed_body_title}
                        length={title.length}
                        maxLength={MessageEmbedTitleSchema.maxLength!}
                    >
                        <OutlinedInput
                            value={title}
                            onChange={(e) => dispatch({
                                type: MessageBuilderActionType.SetEmbedTitle,
                                index: embedIndex,
                                value: e.target.value
                            })}
                            type="text"
                            inputProps={{ maxLength: MessageEmbedTitleSchema.maxLength }}
                            disabled={disabled}
                            size="small"
                            margin="none"
                            fullWidth
                        />
                    </EmbedFormItem>
                    <EmbedFormItem label={translations.embed_body_description}>
                        <TextArea
                            value={description}
                            setValue={(description) => dispatch({
                                type: MessageBuilderActionType.SetEmbedDescription,
                                index: embedIndex,
                                value: description
                            })}
                            limit={MessageEmbedDescriptionSchema.maxLength!}
                            rows={5}
                        />
                    </EmbedFormItem>
                    <EmbedFormItem label={translations.embed_body_url} inline>
                        <OutlinedInput
                            value={url}
                            onChange={(e) => dispatch({
                                type: MessageBuilderActionType.SetEmbedUrl,
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
                    <EmbedFormItem label={translations.embed_body_color} inline sx={{ flexGrow: 0 }}>
                        <ColorField
                            value={rgbaToHsva({ ...decimalToRgb(color ?? 0), a: 1 })}
                            setValue={(action) => dispatch({
                                type: MessageBuilderActionType.SetEmbedColor,
                                index: embedIndex,
                                value: rgbToDecimal(hsvaToRgba(getStateActionValue(action, rgbaToHsva({
                                    ...decimalToRgb(color ?? 0),
                                    a: 1
                                }))))
                            })}
                            choices={[]}
                            disabled={disabled}
                            disableAlpha
                            slotProps={{
                                input: {
                                    className: sectionColorFieldCardClasses.control,
                                    sx: {
                                        width: '100%'
                                    }
                                }
                            }}
                            localization={localization}
                        />
                    </EmbedFormItem>
                </EmbedFormContainer>
            </EmbedAccordionDetails>
        </EmbedAccordion>
    );
};
