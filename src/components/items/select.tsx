'use client';

import { Select } from '@lunaproject-discord/web-core/dist/components/Select';
import { MenuItem } from '@mui/material';
import React, { ReactNode } from 'react';
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

interface Props<T> extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps, ItemVariableProps<T> {
    choices: ({ value: T; children?: ReactNode; })[];
}

export const SelectItem = <T, >(
    {
        icon,
        primary,
        secondary,
        value,
        setValue,
        choices,
        disabled
    }: Props<T>
) => (
    <ItemContainer>
        <ItemRowContainer size={secondary ? 'medium' : 'small'}>
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
        </ItemRowContainer>
        <ItemFormContainer>
            <Select<T>
                value={value}
                onChange={(e) => setValue(e.target.value as T)}
                disabled={disabled}
                fullWidth
                size="small"
                sx={{ minWidth: 300 }}
            >
                {choices.map((choice) => (
                    <MenuItem key={choice.value as unknown as string} value={choice.value as unknown as string}>
                        {choice.children}
                    </MenuItem>
                ))}
            </Select>
        </ItemFormContainer>
    </ItemContainer>
);
