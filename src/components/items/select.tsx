import { MenuItem, Select as MuiSelect, SelectChangeEvent, styled } from '@mui/material';
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

const Test = styled(MuiSelect)(({ theme }) => ({
    '& .MuiPaper-root': {
        border: `solid 1px ${theme.palette.divider}`,
        boxShadow: '0 .3rem .5rem rgb(0 0 0 / 15%)'
    }
})) as unknown as typeof MuiSelect;

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
        <ItemRowContainer>
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
        </ItemRowContainer>
        <ItemFormContainer>
            <Test<T>
                value={value}
                onChange={(e: SelectChangeEvent<T>) => setValue(e.target.value as T)}
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
            </Test>
        </ItemFormContainer>
    </ItemContainer>
);
