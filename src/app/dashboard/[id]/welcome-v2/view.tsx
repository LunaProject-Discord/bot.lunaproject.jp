'use client';

import { ManageAfterPendingRolesDialog, ManageBeforePendingRolesDialog } from '@app/dashboard/[id]/welcome-v2/_dialogs';
import { ActionItem, ChannelItem, MessageItem, SwitchItem } from '@components/items';
import { PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { CodeStyleContainer } from '@components/text';
import { GuildConfigurationWelcomeV2 } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { ChannelType } from 'discord-api-types/v10';
import React, { Fragment, useState } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [openBeforePendingMessageBuilder, setOpenBeforePendingMessageBuilder] = useState(false);
    const [openAfterPendingMessageBuilder, setOpenAfterPendingMessageBuilder] = useState(false);
    const [openBeforePendingRolesDialog, setOpenBeforePendingRolesDialog] = useState(false);
    const [openAfterPendingRolesDialog, setOpenAfterPendingRolesDialog] = useState(false);

    const isMemberVerificationGateEnabled = guild.features.includes('MEMBER_VERIFICATION_GATE_ENABLED');

    const welcomeConfiguration = configuration.welcome_v2;
    const [enabled, setEnabled, resetEnabled] = useResettableState(welcomeConfiguration.enabled);
    const [beforePendingEnabled, setBeforePendingEnabled, resetBeforePendingEnabled] = useResettableState(welcomeConfiguration.before_pending.enabled);
    const [beforePendingMessageEnabled, setBeforePendingMessageEnabled, resetBeforePendingMessageEnabled] = useResettableState(welcomeConfiguration.before_pending.message.enabled);
    const [beforePendingMessageChannelId, setBeforePendingMessageChannelId, resetBeforePendingMessageChannelId] = useResettableState(welcomeConfiguration.before_pending.message.channel_id);
    const [beforePendingMessageMessage, setBeforePendingMessageMessage, resetBeforePendingMessageMessage] = useResettableState(welcomeConfiguration.before_pending.message.message);
    const [beforePendingRolesEnabled, setBeforePendingRolesEnabled, resetBeforePendingRolesEnabled] = useResettableState(welcomeConfiguration.before_pending.roles.enabled);
    const [beforePendingRolesRoles, setBeforePendingRolesRoles, resetBeforePendingRolesRoles] = useResettableState(welcomeConfiguration.before_pending.roles.roles);
    const [afterPendingEnabled, setAfterPendingEnabled, resetAfterPendingEnabled] = useResettableState(welcomeConfiguration.after_pending.enabled);
    const [afterPendingMessageEnabled, setAfterPendingMessageEnabled, resetAfterPendingMessageEnabled] = useResettableState(welcomeConfiguration.after_pending.message.enabled);
    const [afterPendingMessageChannelId, setAfterPendingMessageChannelId, resetAfterPendingMessageChannelId] = useResettableState(welcomeConfiguration.after_pending.message.channel_id);
    const [afterPendingMessageMessage, setAfterPendingMessageMessage, resetAfterPendingMessageMessage] = useResettableState(welcomeConfiguration.after_pending.message.message);
    const [afterPendingRolesEnabled, setAfterPendingRolesEnabled, resetAfterPendingRolesEnabled] = useResettableState(welcomeConfiguration.after_pending.roles.enabled);
    const [afterPendingRolesRoles, setAfterPendingRolesRoles, resetAfterPendingRolesRoles] = useResettableState(welcomeConfiguration.after_pending.roles.roles);

    const toObject = (): GuildConfigurationWelcomeV2 => ({
        enabled,
        before_pending: {
            enabled: beforePendingEnabled,
            message: {
                enabled: beforePendingMessageEnabled,
                channel_id: beforePendingMessageChannelId,
                message: beforePendingMessageMessage
            },
            roles: {
                enabled: beforePendingRolesEnabled,
                roles: beforePendingRolesRoles
            }
        },
        after_pending: {
            enabled: afterPendingEnabled,
            message: {
                enabled: afterPendingMessageEnabled,
                channel_id: afterPendingMessageChannelId,
                message: afterPendingMessageMessage
            },
            roles: {
                enabled: afterPendingRolesEnabled,
                roles: afterPendingRolesRoles
            }
        }
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { welcome_v2: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetBeforePendingEnabled();
        resetBeforePendingMessageEnabled();
        resetBeforePendingMessageChannelId();
        resetBeforePendingMessageMessage();
        resetBeforePendingRolesEnabled();
        resetBeforePendingRolesRoles();
        resetAfterPendingEnabled();
        resetAfterPendingMessageEnabled();
        resetAfterPendingMessageChannelId();
        resetAfterPendingMessageMessage();
        resetAfterPendingRolesEnabled();
        resetAfterPendingRolesRoles();
    };

    return (
        <Fragment>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.welcome_message}</Typography>
                    <Typography>{translations.welcome_message_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <Alert severity="warning">
                        <AlertTitle>「ようこそメッセージ」が生まれ変わります！</AlertTitle>
                        <Box sx={{ mb: .5 }}>
                            ルール スクリーニングへの対応や、ユーザーや Bot に自動で役職を付与できるようになります。<br />
                            現在、この機能はベータ公開中です。利用するには「ようこそメッセージ」からの移行が必要です。
                        </Box>
                        <Button
                            disableElevation
                            variant="contained"
                        >
                            設定データを移行する
                        </Button>
                    </Alert>
                </SectionContent>
            </Section>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.welcome_message_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.welcome_message_before_pending}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.welcome_message_before_pending_enabled}
                        checked={beforePendingEnabled}
                        setChecked={setBeforePendingEnabled}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle
                    variant="h6"
                    fontWeight={400}
                    color={enabled && beforePendingEnabled ? 'text.primary' : 'text.disabled'}
                >
                    {translations.welcome_message_message}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.welcome_message_before_pending_message_enabled}
                        checked={beforePendingMessageEnabled}
                        setChecked={setBeforePendingMessageEnabled}
                        disabled={!enabled || !beforePendingEnabled}
                    />
                    <ChannelItem
                        primary={translations.send_message_channel}
                        value={beforePendingMessageChannelId}
                        setValue={setBeforePendingMessageChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled || !beforePendingEnabled || !beforePendingMessageEnabled}
                        localization={localization}
                    />
                    <MessageItem
                        primary={translations.customize_message}
                        secondary={translations.welcome_message_before_pending_message_edit_description}
                        value={beforePendingMessageMessage}
                        setValue={setBeforePendingMessageMessage}
                        disabled={!enabled || !beforePendingEnabled || !beforePendingMessageEnabled}
                        open={openBeforePendingMessageBuilder}
                        setOpen={setOpenBeforePendingMessageBuilder}
                        localization={localization}
                    >
                        <CodeStyleContainer>{translations.welcome_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle
                    variant="h6"
                    fontWeight={400}
                    color={enabled && beforePendingEnabled ? 'text.primary' : 'text.disabled'}
                >
                    {translations.welcome_message_roles}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.welcome_message_before_pending_roles_enabled}
                        checked={beforePendingRolesEnabled}
                        setChecked={setBeforePendingRolesEnabled}
                        disabled={!enabled || !beforePendingEnabled}
                    />
                    <ActionItem
                        primary={translations.welcome_message_manage_roles}
                        onAction={() => setOpenBeforePendingRolesDialog(true)}
                        disabled={!enabled || !beforePendingEnabled || !beforePendingRolesEnabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.welcome_message_after_pending}
                </SectionTitle>
                <SectionContent>
                    {!isMemberVerificationGateEnabled && <Alert severity="warning">
                        <AlertTitle>この設定を有効にすることはできません</AlertTitle>
                        続けるには、下記の項目を Discord にて有効にしてください。
                        <ul style={{ marginTop: 4, marginBottom: 0, paddingInlineStart: 20 }}>
                            <li>コミュニティ</li>
                            <li>ルール スクリーニング</li>
                        </ul>
                    </Alert>}
                    <SwitchItem
                        primary={translations.welcome_message_after_pending_enabled}
                        checked={afterPendingEnabled}
                        setChecked={setAfterPendingEnabled}
                        disabled={!enabled || !isMemberVerificationGateEnabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle
                    variant="h6"
                    fontWeight={400}
                    color={enabled && afterPendingEnabled ? 'text.primary' : 'text.disabled'}
                >
                    {translations.welcome_message_message}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.welcome_message_after_pending_message_enabled}
                        checked={afterPendingMessageEnabled}
                        setChecked={setAfterPendingMessageEnabled}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled}
                    />
                    <ChannelItem
                        primary={translations.send_message_channel}
                        value={afterPendingMessageChannelId}
                        setValue={setAfterPendingMessageChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled || !afterPendingMessageEnabled}
                        localization={localization}
                    />
                    <MessageItem
                        primary={translations.customize_message}
                        secondary={translations.welcome_message_after_pending_message_edit_description}
                        value={afterPendingMessageMessage}
                        setValue={setAfterPendingMessageMessage}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled || !afterPendingMessageEnabled}
                        open={openAfterPendingMessageBuilder}
                        setOpen={setOpenAfterPendingMessageBuilder}
                        localization={localization}
                    >
                        <CodeStyleContainer>{translations.welcome_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle
                    variant="h6"
                    fontWeight={400}
                    color={enabled && afterPendingEnabled ? 'text.primary' : 'text.disabled'}
                >
                    {translations.welcome_message_roles}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.welcome_message_after_pending_roles_enabled}
                        checked={afterPendingRolesEnabled}
                        setChecked={setAfterPendingRolesEnabled}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled}
                    />
                    <ActionItem
                        primary={translations.welcome_message_manage_roles}
                        onAction={() => setOpenAfterPendingRolesDialog(true)}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled || !afterPendingRolesEnabled}
                    />
                </SectionContent>
            </Section>

            <SaveConfirm
                open={!deepEqual(welcomeConfiguration, toObject(), { strict: true })}
                disableKeyboardShortcuts={openAfterPendingMessageBuilder}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />

            <ManageBeforePendingRolesDialog
                open={openBeforePendingRolesDialog}
                setOpen={setOpenBeforePendingRolesDialog}
                value={beforePendingRolesRoles}
                setValue={setBeforePendingRolesRoles}
                guild={guild}
                localization={localization}
            />
            <ManageAfterPendingRolesDialog
                open={openAfterPendingRolesDialog}
                setOpen={setOpenAfterPendingRolesDialog}
                value={afterPendingRolesRoles}
                setValue={setAfterPendingRolesRoles}
                guild={guild}
                localization={localization}
            />
        </Fragment>
    );
};
