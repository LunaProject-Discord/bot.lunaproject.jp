'use client';

import { ChannelIcon } from '@/components/icons';
import { ChannelPicker, ChannelPickerProps, ChannelPickerType } from '@/components/picker';
import { SnowflakeSelectProps } from '@/components/select';
import { SelectOutlinedInput, SelectOutlinedInputProps } from '@lunaproject/web-core/dist/components/Select';
import { Typography } from '@mui/material';
import xor from 'lodash/xor';
import React, { Fragment, MouseEvent, useCallback, useState } from 'react';

export type ChannelSelectRootProps = SnowflakeSelectProps<ChannelPickerType>;

export interface ChannelSelectSlotProps {
    slotProps?: {
        input?: SelectOutlinedInputProps['slotProps'];
        picker?: ChannelPickerProps['slotProps'];
    };
}

export type ChannelSelectProps = ChannelSelectRootProps & ChannelSelectSlotProps;

export const ChannelSelect = (
    {
        value,
        setValue,
        choices,
        multiple,
        disabled,
        slotProps,
        localization
    }: ChannelSelectProps
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLElement>, channel: ChannelPickerType) => {
        if (multiple) {
            setValue((prevValue) => xor(prevValue, [channel.id]));
        } else {
            setValue(channel.id);
        }

        if (!e.shiftKey)
            setAnchorEl(undefined);
    }, [setValue, multiple]);

    const channel = choices.find((choice) => choice.id === value);
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
                </Typography> : channel && <Fragment>
                    <ChannelIcon channel={channel} />
                    <Typography>{channel.name}</Typography>
                </Fragment>}
            </SelectOutlinedInput>

            <ChannelPicker
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
