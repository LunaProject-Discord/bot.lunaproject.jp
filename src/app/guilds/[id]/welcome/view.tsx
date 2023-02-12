'use client';

import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { APIGuildChannel } from '@lunaproject-discord/web-discord';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { APIGuildForumChannel, APIVoiceChannelBase, ChannelType } from 'discord-api-types/v10';
import React, { useState } from 'react';
import { ChannelItem, MessageItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { Section, SectionContent } from '../../../../components/section';
import { CodeStyleContainer } from '../../../../components/text';
import { GuildSettingsWelcome } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { StyledToolbar } from '../navigation';
import { saveGuildSettings } from '../utils';

interface Props extends GuildSettingsViewProps {
    channels: APIGuildChannel[];
}

export const View = ({ guild, channels, settings, translations }: Props) => {
    const [openMessageBuilder, setOpenMessageBuilder] = useState(false);

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
                        primary={translations.customize_message}
                        secondary={translations.welcome_message_edit_description}
                        value={message}
                        setValue={setMessage}
                        disabled={!enabled}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                    >
                        <CodeStyleContainer>{translations.welcome_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>
            <SaveConfirm
                open={!deepEqual(welcome, toObject(), { strict: true })}
                disableKeyboardShortcuts={openMessageBuilder}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
