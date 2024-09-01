'use client';

import { SearchIcon } from '@/components/icons';
import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { Box, BoxProps, InputBase, styled } from '@mui/material';
import clsx from 'clsx';
import React, { ChangeEvent, forwardRef } from 'react';

export const pickerSearchBoxClasses = generateComponentClasses(
    'PickerSearchBox',
    [
        'root',
        'input'
    ]
);

export const PickerSearchBoxRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(pickerSearchBoxClasses.root, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    backgroundColor: theme.vars.palette.grey[100],
    ...theme.applyStyles('dark', {
        backgroundColor: theme.vars.palette.grey[900]
    })
}));

export interface PickerSearchBoxProps extends SectionCardVariableProps<{ value: string; }>, SectionCardDisabledProps {
    placeholder?: string;
}

export const PickerSearchBox = forwardRef<HTMLInputElement, PickerSearchBoxProps>((
    {
        value,
        setValue,
        disabled,
        placeholder
    },
    ref
) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

    return (
        <PickerSearchBoxRoot>
            <SearchIcon color="action" />
            <InputBase
                inputRef={ref}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
                fullWidth
                className={pickerSearchBoxClasses.input}
            />
        </PickerSearchBoxRoot>
    );
});
PickerSearchBox.displayName = 'PickerSearchBox';
