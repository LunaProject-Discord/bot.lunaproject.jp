import { NumberField } from '@lunaproject-discord/web-core/dist/components/NumberField';
import React from 'react';
import {
    ItemContainer,
    ItemDisabledProps,
    ItemFormContainer,
    ItemIcon,
    ItemIconProps,
    ItemRowContainer,
    ItemTextBlock,
    ItemTextBlockProps,
    ItemVariableProps
} from './index';

interface Props extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps, ItemVariableProps<number> {
    step?: number;
    min?: number;
    max?: number;
}

export const NumberFieldItem = ({ icon, primary, secondary, value, setValue, step, min, max, disabled }: Props) => (
    <ItemContainer>
        <ItemRowContainer>
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
        </ItemRowContainer>
        <ItemFormContainer>
            <NumberField
                value={value}
                setValue={setValue}
                step={step}
                min={min}
                max={max}
                disabled={disabled}
                sx={{
                    width: {
                        xs: '100%',
                        md: 300
                    }
                }}
            />
        </ItemFormContainer>
    </ItemContainer>
);
