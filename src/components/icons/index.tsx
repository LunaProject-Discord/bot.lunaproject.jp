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
import { RedisChannel } from '../../interfaces/redis';

export const ThreadIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path
            d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"
        />
    </SvgIcon>
);

export const ChannelIcon = ({ channel }: { channel: APIChannel | RedisChannel }) => {
    switch (channel.type) {
        case ChannelType.GuildCategory:
            return <CategoryOutlined />;
        case ChannelType.GuildText:
            return <TextChannelIcon />;
        case ChannelType.GuildVoice:
            return <VoiceChannelIcon />;
        case ChannelType.GuildAnnouncement:
        case ChannelType.GuildNews:
            return <AnnouncementChannelIcon />;
        case ChannelType.GuildStageVoice:
            return <StageChannelIcon />;
        case ChannelType.GuildForum:
            return <ForumChannelIcon viewBox="0 0 20 20" />;
        case ChannelType.AnnouncementThread:
        case ChannelType.PublicThread:
        case ChannelType.PrivateThread:
        case ChannelType.GuildNewsThread:
        case ChannelType.GuildPublicThread:
        case ChannelType.GuildPrivateThread:
            return <ThreadIcon />;
        default:
            return <Fragment />;
    }
};
