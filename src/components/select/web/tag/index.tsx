'use client';

import { ColorPickerPreview, TagPicker, TagPickerProps, TagPickerType } from '@/components/picker';
import { SelectOutlinedInput, SelectOutlinedInputProps, SelectProps } from '@/components/select';
import { Typography, useTheme } from '@mui/material';
import xor from 'lodash/xor';
import React, { Fragment, MouseEvent, useCallback, useState } from 'react';

export type TagSelectRootProps = SelectProps<TagPickerType>;

export interface TagSelectSlotProps {
    slotProps?: {
        input?: SelectOutlinedInputProps['slotProps'];
        picker?: TagPickerProps['slotProps'];
    };
}

export type TagSelectProps = TagSelectRootProps & TagSelectSlotProps;

export const TagSelect = (
    {
        value,
        setValue,
        choices,
        multiple,
        disabled,
        slotProps,
        localization
    }: TagSelectProps
) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, tag: TagPickerType) => {
        if (multiple) {
            setValue((prevValue) => xor(prevValue, [tag.id]));
        } else {
            setValue(tag.id);
        }

        if (!e.shiftKey)
            setAnchorEl(undefined);
    }, [setValue, multiple]);

    const tag = choices.find((choice) => choice.id === value);
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
                </Typography> : tag && <Fragment>
                    <ColorPickerPreview
                        hsva={tag.color}
                        width={theme.spacing(2)}
                        height={theme.spacing(2)}
                    />
                    <Typography>{tag.name}</Typography>
                </Fragment>}
            </SelectOutlinedInput>

            <TagPicker
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
