'use client';

import { ChannelItem, MessageItem, SwitchItem } from '@components/items';
import { PageContent, PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { CodeStyleContainer } from '@components/text';
import { GuildConfigurationWelcome } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { ChannelType } from 'discord-api-types/v10';
import React, { useState } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [openMessageBuilder, setOpenMessageBuilder] = useState(false);

    const welcomeConfiguration = configuration.welcome;
    const [enabled, setEnabled, resetEnabled] = useResettableState(welcomeConfiguration.enabled);
    const [channelId, setChannelId, resetChannelId] = useResettableState(welcomeConfiguration.channel_id);
    const [message, setMessage, resetMessage] = useResettableState(welcomeConfiguration.message);
    const [roles, setRoles, resetRoles] = useResettableState(welcomeConfiguration.roles);

    const toObject = (): GuildConfigurationWelcome => ({ enabled, channel_id: channelId, message, roles });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { welcome: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetChannelId();
        resetMessage();
        resetRoles();
    };

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.welcome_message}</Typography>
                    <Typography>{translations.welcome_message_description}</Typography>
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
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled}
                        localization={localization}
                    />
                    <MessageItem
                        primary={translations.customize_message}
                        secondary={translations.welcome_message_edit_description}
                        value={message}
                        setValue={setMessage}
                        disabled={!enabled}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                        localization={localization}
                    >
                        <CodeStyleContainer>{translations.welcome_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>

            <SaveConfirm
                open={!deepEqual(welcomeConfiguration, toObject(), { strict: true })}
                disableKeyboardShortcuts={openMessageBuilder}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />
        </PageContent>
    );
};
