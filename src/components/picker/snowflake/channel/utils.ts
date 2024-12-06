import { ChannelType } from 'discord-api-types/v10';

export const ChannelSortOrders = {
    Category: ChannelType.GuildCategory,
    Message: [ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildForum, ChannelType.GuildMedia],
    Audio: [ChannelType.GuildVoice, ChannelType.GuildStageVoice]
};
