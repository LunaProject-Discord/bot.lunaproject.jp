'use client';

import { RolePicker, RolePickerProps, RolePickerType } from '@/components/picker';
import { SelectOutlinedInput, SelectOutlinedInputProps, SnowflakeSelectProps } from '@/components/select';
import { getRoleColor } from '@/utils/discord';
import { Box, Typography } from '@mui/material';
import xor from 'lodash/xor';
import { size } from 'polished';
import React, { Fragment, MouseEvent, useCallback, useState } from 'react';

export type RoleSelectRootProps = SnowflakeSelectProps<RolePickerType>;

export interface RoleSelectSlotProps {
    slotProps?: {
        input?: SelectOutlinedInputProps['slotProps'];
        picker?: RolePickerProps['slotProps'];
    };
}

export type RoleSelectProps = RoleSelectRootProps & RoleSelectSlotProps;

export const RoleSelect = (
    {
        value,
        setValue,
        choices,
        multiple,
        disabled,
        slotProps,
        localization
    }: RoleSelectProps
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const handleChoiceClick = useCallback((_: MouseEvent<HTMLDivElement>, role: RolePickerType) => {
        if (multiple) {
            setValue((roles) => xor(roles, [role.id]));
        } else {
            setValue(role.id);
        }

        setAnchorEl(undefined);
    }, [setValue, multiple]);

    const role = choices.find((choice) => choice.id === value);
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
                </Typography> : role && <Fragment>
                    <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
                    <Typography>{role.name}</Typography>
                </Fragment>}
            </SelectOutlinedInput>

            <RolePicker
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
