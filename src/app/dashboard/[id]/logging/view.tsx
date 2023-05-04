'use client';

import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { ChannelType } from 'discord-api-types/v10';
import React from 'react';
import { SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { GuildSettingsLogging } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';
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

export const View = ({ guild, settings, localization }: GuildSettingsViewProps) => {
    const { translations } = localization;

    const logging = settings.logging;
    const [enabled, setEnabled, resetEnabled] = useResettableState(logging.enabled);
    const [moderation, setModeration, resetModeration] = useResettableState(logging.moderation);
    const [member, setMember, resetMember] = useResettableState(logging.member);
    const [voice, setVoice, resetVoice] = useResettableState(logging.voice);
    const [category, setCategory, resetCategory] = useResettableState(logging.category);
    const [textChannel, setTextChannel, resetTextChannel] = useResettableState(logging.text_channel);
    const [voiceChannel, setVoiceChannel, resetVoiceChannel] = useResettableState(logging.voice_channel);
    const [role, setRole, resetRole] = useResettableState(logging.role);
    const [emote, setEmote, resetEmote] = useResettableState(logging.emote);
    const [invite, setInvite, resetInvite] = useResettableState(logging.invite);
    const [webhook, setWebhook, resetWebhook] = useResettableState(logging.webhook);
    const [integration, setIntegration, resetIntegration] = useResettableState(logging.integration);
    const [message, setMessage, resetMessage] = useResettableState(logging.message);

    const channels = guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice);

    const toObject = (): GuildSettingsLogging => ({
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

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            logging: toObject()
        }
    );

    const handleActionCancel = () => {
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
                    <Typography variant="body1">{translations.logging_description}</Typography>
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
                open={!deepEqual(logging, toObject(), { strict: true })}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
