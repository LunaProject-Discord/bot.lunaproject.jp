'use client';

import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { APIGuildForumChannel, APIVoiceChannelBase, ChannelType } from 'discord-api-types/v10';
import React from 'react';
import { ChannelItem, MessageItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { Section, SectionContent } from '../../../../components/section';
import { GuildSettingsWelcome } from '../../../../interfaces/bot';
import { APIGuildChannel } from '../../../../interfaces/discord';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { useResettableState } from '../../../../utils/state';
import { StyledToolbar } from '../navigation';
import { saveGuildSettings } from '../utils';

interface Props extends GuildSettingsViewProps {
    channels: APIGuildChannel[];
}

export const View = ({ guild, channels, settings, translations }: Props) => {
    const welcome = settings.welcome;
    const [enabled, setEnabled, resetEnabled] = useResettableState(welcome.enabled);
    const [channelId, setChannelId, resetChannelId] = useResettableState(welcome.channel_id);
    const [message, setMessage, resetMessage] = useResettableState(welcome.message);
    const [roles, setRoles, resetRoles] = useResettableState(welcome.roles);

    const toObject = (): GuildSettingsWelcome => ({ enabled, channel_id: channelId, message, roles });

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            welcome: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
        resetChannelId();
        resetMessage();
        resetRoles();
    };

    return (
        <PageContent position="relative">
            <StyledToolbar />
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.welcome_message}</Typography>
                    <Typography variant="body1">{translations.welcome_message_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.welcome_message_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <ChannelItem
                        primary={translations.send_message_channel}
                        value={channelId}
                        setValue={setChannelId}
                        choices={channels.filter((channel): channel is Exclude<APIGuildChannel, APIGuildForumChannel | APIVoiceChannelBase<any>> => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled}
                    />
                    <MessageItem
                        primary={translations.edit_message}
                        secondary="ユーザーがサーバーに参加したときに送信されるメッセージをカスタマイズできます。"
                        value={message}
                        setValue={setMessage}
                        disabled={!enabled}
                    >
                        {translations.welcome_message_hint}
                    </MessageItem>
                </SectionContent>
            </Section>
            <SaveConfirm
                open={!deepEqual(welcome, toObject(), { strict: true })}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
