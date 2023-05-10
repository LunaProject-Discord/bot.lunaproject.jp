'use client';

import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { APIGuildChannel } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { ListItemButtonProps, ListItemText, Theme, Typography, useMediaQuery } from '@mui/material';
import { ChannelType } from 'discord-api-types/v10';
import { ellipsis } from 'polished';
import React, { Fragment, useEffect, useState } from 'react';
import { PopoverProps } from '../../../interfaces/mui';
import { RedisChannel } from '../../../interfaces/redis';
import { filterPredicateChannel, sortChannels } from '../../../utils/discord';
import { ChannelIcon } from '../../icons';
import {
    ItemFormContainer,
    ItemIcon,
    ItemRoot,
    ItemRowContainer,
    ItemTextBlock,
    SearchBox,
    Select,
    SnowflakeItemProps,
    SnowflakeSelectProps
} from '../index';
import { List, ListItemButton, ListItemIcon, ListSubheader } from './index';

type Channel = APIGuildChannel | RedisChannel;

export interface ChannelListItemProps extends ListItemButtonProps {
    channel: Channel;
}

export const ChannelListItem = ({ channel, ...props }: ChannelListItemProps) => (
    <ListItemButton key={channel.id} sx={{ gap: 1 }} {...props}>
        <ListItemIcon><ChannelIcon channel={channel} /></ListItemIcon>
        <ListItemText primary={channel.name} primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }} />
    </ListItemButton>
);

export type ChannelProps = SnowflakeItemProps<Channel>;

export type ChannelPopoverProps = PopoverProps & ChannelProps;

export const ChannelPopover = (
    {
        anchorEl,
        setAnchorEl,
        value,
        setValue,
        choices,
        ...props
    }: ChannelPopoverProps
) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const open = Boolean(anchorEl);

    const [search, setSearch] = useState('');

    const guildChannels = sortChannels(choices);
    const categories = guildChannels.filter((channel) => channel.type === ChannelType.GuildCategory);
    const textChannels = guildChannels.filter((channel) => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildForum);
    const voiceChannels = guildChannels.filter((channel) => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice);
    const channels = [...textChannels, ...voiceChannels];

    const handlePopupClose = () => {
        setSearch('');
        setAnchorEl(null);
    };

    const handleChange = (channel: Channel) => {
        setValue(channel.id);
        handlePopupClose();
    };

    useEffect(() => {
        if (open && isDesktop)
            setTimeout(() => document.getElementById('popover-search')?.focus());
    }, [open]);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopupClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ zIndex: 1600 }}
            PaperProps={{ sx: { width: 300 } }}
            {...props}
        >
            <SearchBox
                id="popover-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="チャンネルを検索..."
            />
            <List subheader={<li style={{ height: 8 }} />}>
                {[undefined, ...categories].filter((category) => search.length < 1 || channels.some((channel) => channel.parent_id == category?.id && filterPredicateChannel(channel, search))).map((category) => (
                    <li key={category?.id ?? 'no_parent'}>
                        <ul>
                            {category && <ListSubheader>{category.name}</ListSubheader>}
                            {channels.filter((channel) => channel.parent_id == category?.id && filterPredicateChannel(channel, search)).map((channel) => (
                                <ChannelListItem
                                    key={channel.id}
                                    channel={channel}
                                    selected={value === channel.id}
                                    onClick={() => handleChange(channel)}
                                />
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </Popover>
    );
};

export type ChannelSelectProps = ItemDisabledProps & ChannelProps & SnowflakeSelectProps<ChannelPopoverProps>;

export const ChannelSelect = ({ value, setValue, choices, disabled, selectSx, popoverProps }: ChannelSelectProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const channel = choices.find((channel) => channel.id === value);
    return (
        <Fragment>
            <Select
                open={Boolean(anchorEl)}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
                sx={selectSx}
            >
                {channel && <Fragment>
                    <ChannelIcon channel={channel} />
                    <Typography variant="body1">{channel.name}</Typography>
                </Fragment>}
            </Select>

            <ChannelPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value={value}
                setValue={setValue}
                choices={choices}
                {...popoverProps}
            />
        </Fragment>
    );
};

export type ChannelItemProps = ItemProps & ChannelProps;

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
        sx
    }: ChannelItemProps
) => (
    <ItemRoot sx={sx}>
        <ItemRowContainer size={secondary ? 'medium' : 'small'}>
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
                selectSx={{
                    width: {
                        xs: '100%',
                        md: 300
                    }
                }}
            />
        </ItemFormContainer>
    </ItemRoot>
);
