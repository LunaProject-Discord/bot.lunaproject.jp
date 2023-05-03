'use client';

import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { ChannelType } from 'discord-api-types/v10';
import React, { useState } from 'react';
import { ChannelItem, MessageItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { CodeStyleContainer } from '../../../../components/text';
import { GuildSettingsGoodbye } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';

export const View = ({ guild, settings, translations }: GuildSettingsViewProps) => {
    const [openMessageBuilder, setOpenMessageBuilder] = useState(false);

    const goodbye = settings.goodbye;
    const [enabled, setEnabled, resetEnabled] = useResettableState(goodbye.enabled);
    const [channelId, setChannelId, resetChannelId] = useResettableState(goodbye.channel_id);
    const [message, setMessage, resetMessage] = useResettableState(goodbye.message);

    const toObject = (): GuildSettingsGoodbye => ({ enabled, channel_id: channelId, message });

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            goodbye: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
        resetChannelId();
        resetMessage();
    };

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.goodbye_message}</Typography>
                    <Typography variant="body1">{translations.goodbye_message_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.goodbye_message_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <ChannelItem
                        primary={translations.send_message_channel}
                        value={channelId}
                        setValue={setChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled}
                    />
                    <MessageItem
                        primary={translations.customize_message}
                        secondary={translations.goodbye_message_edit_description}
                        value={message}
                        setValue={setMessage}
                        disabled={!enabled}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                    >
                        <CodeStyleContainer>{translations.goodbye_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>
            <SaveConfirm
                open={!deepEqual(goodbye, toObject(), { strict: true })}
                disableKeyboardShortcuts={openMessageBuilder}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
