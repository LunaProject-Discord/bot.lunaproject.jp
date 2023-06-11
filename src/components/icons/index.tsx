'use client';

import { RedisChannel } from '@interfaces/redis';
import {
    AnnouncementChannelIcon,
    ForumChannelIcon,
    StageChannelIcon,
    TextChannelIcon,
    VoiceChannelIcon
} from '@lunaproject-discord/web-core/dist/components/Icons/channels';
import { CategoryOutlined } from '@mui/icons-material';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { APIChannel, ChannelType } from 'discord-api-types/v10';
import React, { Fragment } from 'react';

export const ThreadIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path
            d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"
        />
    </SvgIcon>
);

interface ChannelIconProps extends SvgIconProps {
    channel: APIChannel | RedisChannel | number;
}

export const ChannelIcon = ({ channel, ...props }: ChannelIconProps) => {
    switch (typeof channel === 'number' ? channel : channel.type) {
        case ChannelType.GuildCategory:
            return <CategoryOutlined {...props} />;
        case ChannelType.GuildText:
            return <TextChannelIcon {...props} />;
        case ChannelType.GuildVoice:
            return <VoiceChannelIcon {...props} />;
        case ChannelType.GuildAnnouncement:
        case ChannelType.GuildNews:
            return <AnnouncementChannelIcon {...props} />;
        case ChannelType.GuildStageVoice:
            return <StageChannelIcon {...props} />;
        case ChannelType.GuildForum:
            return <ForumChannelIcon viewBox="0 0 20 20" {...props} />;
        case ChannelType.AnnouncementThread:
        case ChannelType.PublicThread:
        case ChannelType.PrivateThread:
        case ChannelType.GuildNewsThread:
        case ChannelType.GuildPublicThread:
        case ChannelType.GuildPrivateThread:
            return <ThreadIcon {...props} />;
        default:
            return <Fragment />;
    }
};

export const CommandIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M7 21L14.9 3H17L9.1 21H7Z" />
    </SvgIcon>
);

export const CommandBoxIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9.3 19H7L14.7 5H17L9.3 19Z" />
    </SvgIcon>
);
