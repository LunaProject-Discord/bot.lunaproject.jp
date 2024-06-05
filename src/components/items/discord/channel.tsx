'use client';

import { LocalizationProps } from '@/interfaces/localization';
import { PopoverProps } from '@/interfaces/mui';
import { RedisChannel } from '@/interfaces/redis';
import { filterPredicateChannel, sortChannels } from '@/utils/discord';
import { Popover } from '@lunaproject/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemProps } from '@lunaproject/web-core/dist/components/SectionItems';
import { APIGuildChannel } from '@lunaproject/web-discord/dist/interfaces';
import { ListItemButtonProps, ListItemText, popoverClasses, Theme, Typography, useMediaQuery } from '@mui/material';
import { ChannelType } from 'discord-api-types/v10';
import { ellipsis } from 'polished';
import React, { ChangeEvent, Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChannelIcon } from '../../icons';
import {
    ItemFormContainer,
    ItemIcon,
    ItemRoot,
    ItemRowContainer,
    ItemTextBlock,
    ListRoot,
    SearchBox,
    Select,
    SnowflakeItemProps,
    SnowflakeSelectProps
} from '../index';
import { ListItemButton, ListItemIcon, ListSubheader } from './index';

type Channel = APIGuildChannel | RedisChannel;

export interface ChannelListItemProps extends ListItemButtonProps {
    channel: Channel;
}

export const ChannelListItem = ({ channel, sx, ...props }: ChannelListItemProps) => (
    <ListItemButton key={channel.id} sx={{ width: '100% !important', left: '0 !important', ...sx }} {...props}>
        <ListItemIcon><ChannelIcon channel={channel} /></ListItemIcon>
        <ListItemText primary={channel.name} primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }} />
    </ListItemButton>
);

export interface ChannelListProps {
    category: Channel | undefined;
    channels: Channel[];
    selected: string;
    selectedIndex: number;
    onChange: (channel: Channel) => void;
}

export const ChannelList = ({ category, channels, selected, selectedIndex, onChange }: ChannelListProps) => {
    const ref = useRef<HTMLLIElement | null>(null);

    const [height, setHeight] = useState<number | undefined>(0);

    useEffect(() => {
        setHeight(ref.current?.clientHeight);
    }, [ref.current?.clientHeight]);

    return (
        <li key={category?.id ?? 'no_parent'}>
            <ul>
                {category && <ListSubheader ref={ref}>{category.name}</ListSubheader>}
                {channels.filter((channel) => channel.parent_id == category?.id).map((channel) => (
                    <ChannelListItem
                        key={channel.id}
                        id={channel.id}
                        channel={channel}
                        selected={selected === channel.id}
                        onClick={() => onChange(channel)}
                        sx={{
                            scrollMarginTop: height,
                            bgcolor: selectedIndex === channels.indexOf(channel) ? 'action.selected' : 'transparent'
                        }}
                    />
                ))}
            </ul>
        </li>
    );
};


export type ChannelProps = SnowflakeItemProps<Channel>;

export type ChannelPopoverProps = PopoverProps & ChannelProps & LocalizationProps;

export const ChannelPopover = (
    {
        anchorEl,
        setAnchorEl,
        value,
        setValue,
        choices,
        localization: { translations },
        ...props
    }: ChannelPopoverProps
) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const open = Boolean(anchorEl);

    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const guildChannels = sortChannels(choices);
    const categories = guildChannels.filter((channel) => channel.type === ChannelType.GuildCategory);
    const textChannels = guildChannels.filter((channel) => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildForum);
    const voiceChannels = guildChannels.filter((channel) => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice);
    const channels = [...textChannels, ...voiceChannels].filter((channel) => filterPredicateChannel(channel, search));

    const filteredCategories = [undefined, ...categories].filter((category) => search.length < 1 || channels.some((channel) => channel.parent_id == category?.id));
    const filteredChannels = filteredCategories.flatMap((category) => channels.filter((channel) => channel.parent_id == category?.id));

    const handlePopupClose = () => {
        setSearch('');
        setSelectedIndex(-1);
        setAnchorEl(null);
    };

    const handleChange = (channel: Channel) => {
        setValue(channel.id);
        handlePopupClose();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSelectedIndex(-1);
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || channels.length < 1) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (selectedIndex > -1)
                    handleChange(filteredChannels[selectedIndex]);
                return;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const i = index > 0 ? index - 1 : filteredChannels.length - 1;
                    document.getElementById(filteredChannels[i].id)?.scrollIntoView({ block: 'nearest' });
                    return i;
                });
                return;
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const i = index < filteredChannels.length - 1 ? index + 1 : 0;
                    document.getElementById(filteredChannels[i].id)?.scrollIntoView({ block: 'nearest' });
                    return i;
                });
                return;
        }
    };

    useEffect(() => {
        if (open && isDesktop)
            setTimeout(() => document.getElementById('popover-search')?.focus());
    }, [open, isDesktop]);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopupClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            slotProps={{
                paper: {
                    sx: {
                        width: 300
                    }
                }
            }}
            sx={{ zIndex: 1600 }}
            {...props}
        >
            <SearchBox
                id="popover-search"
                value={search}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder={translations.search_channels as string}
            />
            <ListRoot subheader={<li style={{ height: 8 }} />} sx={{ pt: 0 }}>
                {filteredCategories.map((category) => (
                    <ChannelList
                        key={category?.id ?? 'no_parent'}
                        category={category}
                        channels={filteredChannels}
                        selected={value}
                        selectedIndex={selectedIndex}
                        onChange={handleChange}
                    />
                ))}
            </ListRoot>
        </Popover>
    );
};

export type ChannelSelectProps =
    ItemDisabledProps
    & ChannelProps
    & SnowflakeSelectProps<ChannelPopoverProps>
    & LocalizationProps;

export const ChannelSelect = (
    {
        value,
        setValue,
        choices,
        disabled,
        localization,
        sx,
        popoverProps
    }: ChannelSelectProps
) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const channel = choices.find((channel) => channel.id === value);
    return (
        <Fragment>
            <Select
                ref={ref}
                open={Boolean(anchorEl)}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
                sx={sx}
            >
                {channel && <Fragment>
                    <ChannelIcon channel={channel} color="action" />
                    <Typography>{channel.name}</Typography>
                </Fragment>}
            </Select>

            <ChannelPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value={value}
                setValue={setValue}
                choices={choices}
                localization={localization}
                sx={{
                    [`& .${popoverClasses.paper}`]: {
                        minWidth: ref.current?.offsetWidth
                    }
                }}
                {...popoverProps}
            />
        </Fragment>
    );
};

export type ChannelItemProps = ItemProps & ChannelProps & LocalizationProps;

export const ChannelItem = (
    {
        icon,
        iconSx,
        primary,
        secondary,
        primaryTypographyProps,
        secondaryTypographyProps,
        value,
        setValue,
        choices,
        disabled,
        localization,
        sx
    }: ChannelItemProps
) => (
    <ItemRoot sx={sx}>
        <ItemRowContainer dense={!secondary}>
            <ItemIcon icon={icon} iconSx={iconSx} />
            <ItemTextBlock
                primary={primary}
                secondary={secondary}
                primaryTypographyProps={primaryTypographyProps}
                secondaryTypographyProps={secondaryTypographyProps}
                disabled={disabled}
            />
        </ItemRowContainer>
        <ItemFormContainer>
            <ChannelSelect
                value={value}
                setValue={setValue}
                choices={choices}
                disabled={disabled}
                localization={localization}
                sx={{ width: { xs: '100%', md: 300 } }}
            />
        </ItemFormContainer>
    </ItemRoot>
);
