'use client';

import { EditableItemProps, OverrideGroupProps } from '@/app/dashboard/[id]/commands/_components';
import {
    DefaultEditableItem,
    EditableItem,
    Group,
    GroupTitle
} from '@/app/dashboard/[id]/commands/_dialog/_components';
import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { AddIcon, ChannelIcon } from '@/components/icons';
import { ChannelPicker, ChannelPickerType } from '@/components/picker';
import { GuildChannelsViewProps } from '@/interfaces/view';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PickerChoiceClickHandler } from '@lunaproject/web-core/dist/components/Picker';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Fragment, useCallback, useState } from 'react';

type ChannelItemProps = EditableItemProps & GuildChannelsViewProps;

export const ChannelItem = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Omit<ChannelItemProps, 'children'>
) => {
    const channel = channels.find((channel) => channel.id === value.id)!!;
    return (
        <EditableItem value={value} setValue={setValue} disabled={disabled} localization={localization}>
            <ChannelIcon channel={channel} color="action" />
            <Typography sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {channel.name}
            </Typography>
        </EditableItem>
    );
};

export const Channels = (
    {
        default: defaultValue,
        setDefault,
        overrides,
        setOverrides,
        channels,
        localization
    }: OverrideGroupProps & GuildChannelsViewProps
) => {
    const { translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const updateOverride = useCallback((id: string, data: EditablePermissionOverride | undefined) => setOverrides((values) => {
        let array = [...values];

        const i = array.findIndex((data) => data._id === id);
        if (i !== -1)
            data ? array.splice(i, 1, data) : array.splice(i, 1);

        if (i === -1 && data)
            array.push(data);

        return array;
    }), [setOverrides]);

    const handleChoiceClick: PickerChoiceClickHandler<ChannelPickerType> = useCallback((_, channel) => {
        const _id = nanoid();
        updateOverride(_id, { _id, id: channel.id, override: true });
        setAnchorEl(undefined);
    }, [updateOverride]);

    return (
        <Fragment>
            <Group>
                <GroupTitle>
                    {translations.command_permissions_channels}
                    <Button
                        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                        variant="outlined"
                        corners="extended"
                        size="small"
                        startIcon={<AddIcon />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </GroupTitle>
                <DefaultEditableItem value={defaultValue} setValue={setDefault}>
                    {translations.commands_permissions_all_channels}
                </DefaultEditableItem>
                {overrides.filter((override) => channels.some((channel) => channel.id === override.id)).map((override) => (
                    <ChannelItem
                        key={override._id}
                        value={override}
                        setValue={(action) => updateOverride(override._id, getStateActionValue(action, override))}
                        channels={channels}
                        localization={localization}
                    />
                ))}
            </Group>

            <ChannelPicker
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                choices={channels.filter((channel) => !overrides.some(({ id }) => id === channel.id))}
                onClick={handleChoiceClick}
                slotProps={{
                    desktop: {
                        root: {
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                        }
                    }
                }}
                localization={localization}
            />
        </Fragment>
    );
};
