'use client';

import { MemberPicker, MemberPickerProps, MemberPickerType } from '@/components/picker';
import { SelectOutlinedInput, SelectOutlinedInputProps, SnowflakeSelectProps } from '@/components/select';
import { getMemberAvatar, getUserAvatar } from '@/utils/cdn';
import { getMemberDisplayName } from '@/utils/discord';
import { Avatar, Typography } from '@mui/material';
import xor from 'lodash/xor';
import React, { Fragment, MouseEvent, useCallback, useState } from 'react';

export type MemberSelectRootProps = SnowflakeSelectProps<MemberPickerType>;

export interface MemberSelectSlotProps {
    slotProps?: {
        input?: SelectOutlinedInputProps['slotProps'];
        picker?: MemberPickerProps['slotProps'];
    };
}

export type MemberSelectProps = MemberSelectRootProps & MemberSelectSlotProps;

export const MemberSelect = (
    {
        value,
        setValue,
        choices,
        multiple,
        disabled,
        slotProps,
        localization
    }: MemberSelectProps
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const handleChoiceClick = useCallback((_: MouseEvent<HTMLDivElement>, member: MemberPickerType) => {
        if (multiple) {
            setValue((members) => xor(members, [member.user.id]));
        } else {
            setValue(member.user.id);
        }

        setAnchorEl(undefined);
    }, [setValue, multiple]);

    const member = choices.find((choice) => choice.user.id === value);
    return (
        <Fragment>
            <SelectOutlinedInput
                open={Boolean(anchorEl)}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
                slotProps={slotProps?.input}
            >
                {multiple ? <Typography>
                    {choices.filter((choice) => value.includes(choice.user.id)).map((choice) => getMemberDisplayName(choice)).join(', ')}
                </Typography> : member && <Fragment>
                    <Avatar
                        src={'guild_id' in member ? getMemberAvatar(member, member.guild_id) : getUserAvatar(member.user)}
                        alt=" "
                        sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                    />
                    <Typography>{getMemberDisplayName(member)}</Typography>
                </Fragment>}
            </SelectOutlinedInput>
            <MemberPicker
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
