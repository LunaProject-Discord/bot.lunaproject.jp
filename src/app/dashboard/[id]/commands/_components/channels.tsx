import {
    DefaultEditableItem,
    EditableItem,
    EditableItemProps,
    OverrideGroupProps
} from '@/app/dashboard/[id]/commands/_components';
import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { AddIcon, ChannelIcon } from '@/components/icons';
import { ChannelPopover } from '@/components/items';
import { GuildChannelsViewProps } from '@/interfaces/view';
import { Section, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Button, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Fragment, useState } from 'react';

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

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const updateOverride = (id: string, data: EditablePermissionOverride | undefined) => setOverrides((values) => {
        let array = [...values];

        const i = array.findIndex((data) => data._id === id);
        if (i !== -1)
            data ? array.splice(i, 1, data) : array.splice(i, 1);

        if (i === -1 && data)
            array.push(data);

        return array;
    });

    return (
        <Fragment>
            <Section>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    {translations.commands_permissions_channels}
                    <Button
                        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                        disableElevation
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </SectionTitle>
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
            </Section>

            <ChannelPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value=""
                setValue={(action) => {
                    const _id = nanoid();
                    updateOverride(_id, { _id, id: getStateActionValue(action, ''), override: true });
                }}
                choices={channels.filter((channel) => !overrides.some(({ id }) => id === channel.id))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                localization={localization}
            />
        </Fragment>
    );
};
