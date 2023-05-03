'use client';

import {
    AnnouncementChannelIcon,
    ForumChannelIcon,
    Popover,
    StageChannelIcon,
    TextChannelIcon,
    VoiceChannelIcon
} from '@lunaproject-discord/web-core';
import { APIGuildChannel } from '@lunaproject-discord/web-discord';
import { ListItemButtonProps, ListItemText, PopoverProps, Typography } from '@mui/material';
import { APIGuildCategoryChannel, APITextBasedChannel, APIVoiceChannelBase, ChannelType } from 'discord-api-types/v10';
import { ellipsis } from 'polished';
import React, { Fragment, MouseEvent, useState } from 'react';
import { RedisChannel } from '../../../interfaces/redis';
import { filterPredicateChannel, sortChannels } from '../../../utils/discord';
import {
    ItemDisabledProps,
    ItemFormContainer,
    ItemIcon,
    ItemIconProps,
    ItemRoot,
    ItemRowContainer,
    ItemTextBlock,
    ItemTextBlockProps,
    SearchBox,
    Select,
    SnowflakeItemProps
} from '../index';
import { List, ListItemButton, ListItemIcon, ListSubheader } from './index';

interface ListItemProps extends ListItemButtonProps {
    channel: APIGuildChannel;
}

const ListItem = ({ channel, ...props }: ListItemProps) => (
    <ListItemButton key={channel.id} sx={{ gap: 1 }} {...props}>
        <ListItemIcon>
            {channel.type === ChannelType.GuildText && <TextChannelIcon />}
            {channel.type === ChannelType.GuildVoice && <VoiceChannelIcon />}
            {channel.type === ChannelType.GuildAnnouncement && <AnnouncementChannelIcon />}
            {channel.type === ChannelType.GuildStageVoice && <StageChannelIcon />}
            {channel.type === ChannelType.GuildForum && <ForumChannelIcon />}
        </ListItemIcon>
        <ListItemText primary={channel.name} primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }} />
    </ListItemButton>
);

type Props = SnowflakeItemProps<RedisChannel>;

interface ChannelPopoverProps extends PopoverProps, Props {
    anchorEl: PopoverProps['anchorEl'];
    onPopupClose: () => void;
}

export const ChannelPopover = (
    {
        open,
        anchorEl,
        onPopupClose,
        value,
        setValue,
        choices,
        ...props
    }: ChannelPopoverProps
) => {
    const [search, setSearch] = useState('');

    const guildChannels = sortChannels(choices);
    const categories = guildChannels.filter((channel): channel is APIGuildCategoryChannel => channel.type === ChannelType.GuildCategory);
    const textChannels = guildChannels.filter((channel): channel is Extract<APIGuildChannel, APITextBasedChannel<any>> => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildForum);
    const voiceChannels = guildChannels.filter((channel): channel is Extract<APIGuildChannel, APIVoiceChannelBase<any>> => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice);
    const channels = [...textChannels, ...voiceChannels];

    const handlePopupClose = () => {
        setSearch('');
        onPopupClose();
    };

    const handleChange = (channel: APIGuildChannel) => {
        setValue(channel.id);
        handlePopupClose();
    };

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
                                <ListItem
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

type ChannelItemProps = ItemTextBlockProps & ItemIconProps & ItemDisabledProps & Props;

export const ChannelItem = ({ icon, primary, secondary, value, setValue, choices, disabled }: ChannelItemProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (e: MouseEvent<HTMLDivElement>) => setAnchorEl(e.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const currentChannel = choices.find((channel) => channel.id === value);
    return (
        <Fragment>
            <ItemRoot>
                <ItemRowContainer size={secondary ? 'medium' : 'small'}>
                    <ItemIcon icon={icon} />
                    <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
                </ItemRowContainer>
                <ItemFormContainer>
                    <Select
                        open={open}
                        onClick={handlePopoverOpen}
                        disabled={disabled}
                        sx={{
                            width: {
                                xs: '100%',
                                md: 300
                            }
                        }}
                    >
                        {currentChannel && <Fragment>
                            {currentChannel.type === ChannelType.GuildText && <TextChannelIcon />}
                            {currentChannel.type === ChannelType.GuildVoice && <VoiceChannelIcon />}
                            {currentChannel.type === ChannelType.GuildAnnouncement && <AnnouncementChannelIcon />}
                            {currentChannel.type === ChannelType.GuildStageVoice && <StageChannelIcon />}
                            {currentChannel.type === ChannelType.GuildForum && <ForumChannelIcon />}
                            <Typography variant="body1">{currentChannel.name}</Typography>
                        </Fragment>}
                    </Select>
                </ItemFormContainer>
            </ItemRoot>

            <ChannelPopover
                open={open}
                anchorEl={anchorEl}
                onPopupClose={handlePopoverClose}
                value={value}
                setValue={setValue}
                choices={choices}
            />
        </Fragment>
    );
};
