'use client';

import { GuildPicker, GuildPickerProps, GuildPickerType } from '@/components/picker';
import { SelectOutlinedInput, SelectOutlinedInputProps, SnowflakeSelectProps } from '@/components/select';
import { getGuildIcon } from '@/utils/cdn';
import { Avatar, Typography } from '@mui/material';
import xor from 'lodash/xor';
import React, { Fragment, MouseEvent, useCallback, useState } from 'react';

export type GuildSelectRootProps = SnowflakeSelectProps<GuildPickerType>;

export interface GuildSelectSlotProps {
    slotProps?: {
        input?: SelectOutlinedInputProps['slotProps'];
        picker?: GuildPickerProps['slotProps'];
    };
}

export type GuildSelectProps = GuildSelectRootProps & GuildSelectSlotProps;

export const GuildSelect = (
    {
        value,
        setValue,
        choices,
        multiple,
        disabled,
        slotProps,
        localization
    }: GuildSelectProps
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const handleChoiceClick = useCallback((_: MouseEvent<HTMLDivElement>, guild: GuildPickerType) => {
        if (multiple) {
            setValue((guilds) => xor(guilds, [guild.id]));
        } else {
            setValue(guild.id);
        }

        setAnchorEl(undefined);
    }, [setValue, multiple]);

    const guild = choices.find((choice) => choice.id === value);
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
                </Typography> : guild && <Fragment>
                    <Avatar
                        src={getGuildIcon(guild)}
                        alt=" "
                        sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                    />
                    <Typography>{guild.name}</Typography>
                </Fragment>}
            </SelectOutlinedInput>

            <GuildPicker
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
