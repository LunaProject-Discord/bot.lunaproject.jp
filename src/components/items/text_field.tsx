'use client';

import { OutlinedInput } from '@mui/material';
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

interface Props extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps, ItemVariableProps<string> {
    minLength?: number;
    maxLength?: number;
}

export const TextFieldItem = ({ icon, primary, secondary, value, setValue, minLength, maxLength, disabled }: Props) => (
    <ItemContainer>
        <ItemRowContainer size={secondary ? 'medium' : 'small'}>
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
        </ItemRowContainer>
        <ItemFormContainer>
            <OutlinedInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                inputProps={{
                    minLength,
                    maxLength
                }}
                disabled={disabled}
                size="small"
                margin="none"
                sx={{ width: { xs: '100%', md: 300 } }}
            />
        </ItemFormContainer>
    </ItemContainer>
);
