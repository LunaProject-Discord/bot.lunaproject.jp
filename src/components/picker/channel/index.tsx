'use client';

import { ChannelIcon } from '@/components/icons';
import { ListSubheader } from '@/components/items';
import {
    ChannelSortOrders,
    DesktopChannelPicker,
    getSnowflakeChoiceId,
    MobileChannelPicker,
    PickerSearchBox,
    SnowflakePickerInternalProps,
    SnowflakePickerItemProps,
    SnowflakePickerProps,
    usePickerSearch
} from '@/components/picker';
import { RedisChannel } from '@/interfaces/redis';
import { filterPredicateChannel, sortChannels } from '@/utils/discord';
import { SectionCardDisabledProps, SlotRootProps } from '@lunaproject/web-core/dist/components';
import { APIGuildChannel } from '@lunaproject/web-discord/dist/interfaces';
import { SlotComponentProps } from '@mui/base';
import { List, ListItemButton, ListItemIcon, ListItemText, Theme, useMediaQuery } from '@mui/material';
import deepmerge from 'deepmerge';
import { ellipsis } from 'polished';
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

export const ChannelPickerGroup = ({ category, channels, selected, onClick }: ChannelPickerGroupProps) => {
    const messageChannels = channels.filter((channel) => ChannelSortOrders.Message.includes(channel.type));
    const audioChannels = channels.filter((channel) => ChannelSortOrders.Audio.includes(channel.type));

    return (
        <List>
            {category && <ListSubheader sx={{ top: (theme) => theme.spacing(-1) }}>{category.name}</ListSubheader>}
            {[...messageChannels, ...audioChannels].map((channel, index) => {
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
            <ListItemIcon sx={{ minWidth: 0 }}>
                <ChannelIcon channel={channel} />
            </ListItemIcon>
            <ListItemText
                primary={channel.name}
                primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }}
            />
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

    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));
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
