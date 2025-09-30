'use client';

import { CategoryPicker, CategoryPickerProps, CategoryPickerType, ColorPickerPreview } from '@/components/picker';
import { SelectProps } from '@/components/select';
import { SelectOutlinedInput, SelectOutlinedInputProps } from '@lunaproject/web-core/dist/components/Select';
import { Typography, useTheme } from '@mui/material';
import xor from 'lodash/xor';
import React, { Fragment, MouseEvent, useCallback, useState } from 'react';

export type CategorySelectRootProps = SelectProps<CategoryPickerType>;

export interface CategorySelectSlotProps {
    slotProps?: {
        input?: SelectOutlinedInputProps['slotProps'];
        picker?: CategoryPickerProps['slotProps'];
    };
}

export type CategorySelectProps = CategorySelectRootProps & CategorySelectSlotProps;

export const CategorySelect = (
    {
        value,
        setValue,
        choices,
        multiple,
        disabled,
        slotProps,
        localization
    }: CategorySelectProps
) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLElement>, category: CategoryPickerType) => {
        if (multiple) {
            setValue((prevValue) => xor(prevValue, [category.id]));
        } else {
            setValue(category.id);
        }

        if (!e.shiftKey)
            setAnchorEl(undefined);
    }, [setValue, multiple]);

    const category = choices.find((choice) => choice.id === value);
    return (
        <Fragment>
            <SelectOutlinedInput
                open={Boolean(anchorEl)}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
                slotProps={slotProps?.input}
            >
                {multiple ? <Typography>
                    {choices.filter((choice) => value.includes(choice.id)).map((choice) => choice.name).join(', ')}
                </Typography> : category && <Fragment>
                    <ColorPickerPreview
                        hsva={category.color}
                        width={theme.spacing(2)}
                        height={theme.spacing(2)}
                    />
                    <Typography>{category.name}</Typography>
                </Fragment>}
            </SelectOutlinedInput>

            <CategoryPicker
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                choices={choices}
                selected={multiple ? value : [value]}
                onClick={handleChoiceClick}
                slotProps={slotProps?.picker}
                localization={localization}
            />
        </Fragment>
    );
};
