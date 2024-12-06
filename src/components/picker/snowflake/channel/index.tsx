'use client';

import { ChannelIcon } from '@/components/icons';
import { ListSubheader } from '@/components/items';
import {
    ChannelSortOrders,
    DesktopChannelPicker,
    getSnowflakeChoiceId,
    MobileChannelPicker,
    PickerItemIcon,
    PickerItemText,
    PickerSearchBox,
    SnowflakePickerInternalProps,
    SnowflakePickerItemProps,
    SnowflakePickerProps,
    usePickerSearch
} from '@/components/picker';
import { RedisChannel } from '@/interfaces/redis';
import { filterPredicateChannel, sortChannels } from '@/utils/discord';
import { SectionCardDisabledProps, SlotRootProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { APIGuildChannel } from '@lunaproject/web-discord/dist/interfaces';
import { SlotComponentProps } from '@mui/base';
import { Box, List, ListItemButton, useMediaQuery } from '@mui/material';
import deepmerge from 'deepmerge';
import React, { MouseEvent, useCallback } from 'react';

export type ChannelPickerType = (APIGuildChannel | RedisChannel) & SectionCardDisabledProps;

export type ChannelPickerProps = Omit<SnowflakePickerProps<ChannelPickerType>, 'renderChoice' | 'filter'>;

export interface ChannelPickerInternalProps extends Omit<SnowflakePickerInternalProps<ChannelPickerType>, 'renderChoice' | 'choices' | 'filter'> {
    categories: (ChannelPickerType | undefined)[];
    channels: ChannelPickerType[];
}

export interface ChannelPickerGroupProps extends Pick<ChannelPickerInternalProps, 'selected' | 'onClick'> {
    category: ChannelPickerType | undefined;
    channels: ChannelPickerType[];
}

export type ChannelPickerItemProps = SnowflakePickerItemProps<ChannelPickerType>;

export const ChannelPickerGroup = (
    {
        category,
        channels: _channels,
        selected,
        onClick
    }: ChannelPickerGroupProps
) => {
    const messageChannels = _channels.filter((channel) => ChannelSortOrders.Message.includes(channel.type));
    const audioChannels = _channels.filter((channel) => ChannelSortOrders.Audio.includes(channel.type));

    const channels = [...messageChannels, ...audioChannels];
    if (channels.length < 1)
        return null;

    return (
        <List>
            {category ? <ListSubheader>{category.name}</ListSubheader> : <Box
                component="li"
                sx={{ height: (theme) => theme.spacing(1) }}
            />}
            {channels.map((channel, index) => {
                const id = getSnowflakeChoiceId(channel, index);

                return (
                    <ChannelPickerItem
                        key={id}
                        index={index}
                        choice={channel}
                        selected={selected?.includes(id)}
                        onClick={onClick}
                    />
                );
            })}
        </List>
    );
};

export const ChannelPickerItem = (
    {
        index,
        choice: channel,
        selected,
        onClick
    }: ChannelPickerItemProps
) => {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => onClick?.(e, channel, index);

    return (
        <ListItemButton onClick={handleClick} selected={selected} disabled={channel.disabled}>
            <PickerItemIcon>
                <ChannelIcon channel={channel} />
            </PickerItemIcon>
            <PickerItemText primary={channel.name} />
        </ListItemButton>
    );
};

export const ChannelPicker = (
    {
        choices: _choices,
        onClick,
        search: _search,
        setSearch: _setSearch,
        slotProps,
        ...props
    }: ChannelPickerProps
) => {
    const { translations } = props.localization;

    const { search, setSearch } = usePickerSearch(_search, _setSearch);
    const channels = sortChannels(_choices).filter((channel) => filterPredicateChannel(channel, search));
    const categories = [
        undefined,
        ...channels.filter((category) => ChannelSortOrders.Category === category.type)
    ].filter((category) => channels.some((channel) => channel.parent_id == category?.id));

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, guild: ChannelPickerType, index: number) => {
        onClick?.(e, guild, index);
    }, [onClick]);

    const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));
    const pickerProps = { categories, channels, onClick: handleChoiceClick, search, setSearch, ...props };
    const slotRootProps = {
        searchBox: deepmerge<SlotComponentProps<typeof PickerSearchBox, SlotRootProps, {}>>(
            { placeholder: translations.search_channels as string },
            slotProps?.searchBox ?? {}
        )
    };

    if (isSmall) {
        return (
            <DesktopChannelPicker
                slotProps={deepmerge(slotRootProps, slotProps?.desktop ?? {})}
                {...pickerProps}
            />
        );
    } else {
        return (
            <MobileChannelPicker
                slotProps={deepmerge(slotRootProps, slotProps?.mobile ?? {})}
                {...pickerProps}
            />
        );
    }
};

export * from './desktop';
export * from './mobile';
export * from './utils';
