'use client';

import { PageContent, PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { GuildConfigurationLogging } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { ChannelType } from 'discord-api-types/v10';
import React from 'react';
import { SwitchItem } from '../../../../components/items';
import { saveGuildConfiguration } from '../utils';
import {
    Category,
    Emote,
    GridContainer,
    Integration,
    Invite,
    Member,
    Message,
    Moderation,
    Role,
    TextChannel,
    Voice,
    VoiceChannel,
    Webhook
} from './components';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const loggingConfiguration = configuration.logging;
    const [enabled, setEnabled, resetEnabled] = useResettableState(loggingConfiguration.enabled);
    const [moderation, setModeration, resetModeration] = useResettableState(loggingConfiguration.moderation);
    const [member, setMember, resetMember] = useResettableState(loggingConfiguration.member);
    const [voice, setVoice, resetVoice] = useResettableState(loggingConfiguration.voice);
    const [category, setCategory, resetCategory] = useResettableState(loggingConfiguration.category);
    const [textChannel, setTextChannel, resetTextChannel] = useResettableState(loggingConfiguration.text_channel);
    const [voiceChannel, setVoiceChannel, resetVoiceChannel] = useResettableState(loggingConfiguration.voice_channel);
    const [role, setRole, resetRole] = useResettableState(loggingConfiguration.role);
    const [emote, setEmote, resetEmote] = useResettableState(loggingConfiguration.emote);
    const [invite, setInvite, resetInvite] = useResettableState(loggingConfiguration.invite);
    const [webhook, setWebhook, resetWebhook] = useResettableState(loggingConfiguration.webhook);
    const [integration, setIntegration, resetIntegration] = useResettableState(loggingConfiguration.integration);
    const [message, setMessage, resetMessage] = useResettableState(loggingConfiguration.message);

    const channels = guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice);

    const toObject = (): GuildConfigurationLogging => ({
        enabled,
        moderation,
        member,
        voice,
        category,
        text_channel: textChannel,
        voice_channel: voiceChannel,
        role,
        emote,
        invite,
        webhook,
        integration,
        message
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { logging: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetModeration();
        resetMember();
        resetVoice();
        resetCategory();
        resetTextChannel();
        resetVoiceChannel();
        resetRole();
        resetEmote();
        resetInvite();
        resetWebhook();
        resetIntegration();
        resetMessage();
    };

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.logging}</Typography>
                    <Typography>{translations.logging_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.logging_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                </SectionContent>
            </Section>
            <GridContainer>
                <Moderation
                    value={moderation}
                    setValue={setModeration}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Member
                    value={member}
                    setValue={setMember}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Voice
                    value={voice}
                    setValue={setVoice}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Category
                    value={category}
                    setValue={setCategory}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <TextChannel
                    value={textChannel}
                    setValue={setTextChannel}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <VoiceChannel
                    value={voiceChannel}
                    setValue={setVoiceChannel}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Role
                    value={role}
                    setValue={setRole}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Emote
                    value={emote}
                    setValue={setEmote}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Invite
                    value={invite}
                    setValue={setInvite}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Webhook
                    value={webhook}
                    setValue={setWebhook}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Integration
                    value={integration}
                    setValue={setIntegration}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
                <Message
                    value={message}
                    setValue={setMessage}
                    channels={channels}
                    disabled={!enabled}
                    localization={localization}
                />
            </GridContainer>

            <SaveConfirm
                open={!deepEqual(loggingConfiguration, toObject(), { strict: true })}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />
        </PageContent>
    );
};
