'use client';

import {
    ManageAfterPendingRolesDialog,
    ManageBeforePendingRolesDialog
} from '@/app/dashboard/[id]/member-join/_dialogs';
import { ActionItem, ChannelItem, MessageItem, SwitchItem } from '@/components/items';
import { PageHeader } from '@/components/layout_v2';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { CodeStyleContainer } from '@/components/text';
import { GuildConfigurationMemberJoin } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationMemberJoinSchema } from '@/schemas/bot';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { Alert, AlertTitle, Backdrop, Box, Button, CircularProgress } from '@mui/material';
import { ChannelType } from 'discord-api-types/v10';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const router = useRouter();

    const [openMigratingBackdrop, setOpenMigratingBackdrop] = useState(false);

    const [openBeforePendingMessageBuilder, setOpenBeforePendingMessageBuilder] = useState(false);
    const [openBeforePendingRolesDialog, setOpenBeforePendingRolesDialog] = useState(false);
    const [openAfterPendingMessageBuilder, setOpenAfterPendingMessageBuilder] = useState(false);
    const [openAfterPendingRolesDialog, setOpenAfterPendingRolesDialog] = useState(false);

    const isMemberVerificationGateEnabled = guild.features.includes('MEMBER_VERIFICATION_GATE_ENABLED');

    const memberJoinConfiguration = configuration.member_join;
    const [enabled, setEnabled, resetEnabled] = useResettableState(memberJoinConfiguration.enabled);
    const [beforePendingEnabled, setBeforePendingEnabled, resetBeforePendingEnabled] = useResettableState(memberJoinConfiguration.before_pending.enabled);
    const [beforePendingMessageEnabled, setBeforePendingMessageEnabled, resetBeforePendingMessageEnabled] = useResettableState(memberJoinConfiguration.before_pending.message.enabled);
    const [beforePendingMessageChannelId, setBeforePendingMessageChannelId, resetBeforePendingMessageChannelId] = useResettableState(memberJoinConfiguration.before_pending.message.channel_id);
    const [beforePendingMessageMessage, setBeforePendingMessageMessage, resetBeforePendingMessageMessage] = useResettableState(memberJoinConfiguration.before_pending.message.message);
    const [beforePendingRolesEnabled, setBeforePendingRolesEnabled, resetBeforePendingRolesEnabled] = useResettableState(memberJoinConfiguration.before_pending.roles.enabled);
    const [beforePendingRolesRoles, setBeforePendingRolesRoles, resetBeforePendingRolesRoles] = useResettableState(memberJoinConfiguration.before_pending.roles.roles);
    const [afterPendingEnabled, setAfterPendingEnabled, resetAfterPendingEnabled] = useResettableState(memberJoinConfiguration.after_pending.enabled);
    const [afterPendingMessageEnabled, setAfterPendingMessageEnabled, resetAfterPendingMessageEnabled] = useResettableState(memberJoinConfiguration.after_pending.message.enabled);
    const [afterPendingMessageChannelId, setAfterPendingMessageChannelId, resetAfterPendingMessageChannelId] = useResettableState(memberJoinConfiguration.after_pending.message.channel_id);
    const [afterPendingMessageMessage, setAfterPendingMessageMessage, resetAfterPendingMessageMessage] = useResettableState(memberJoinConfiguration.after_pending.message.message);
    const [afterPendingRolesEnabled, setAfterPendingRolesEnabled, resetAfterPendingRolesEnabled] = useResettableState(memberJoinConfiguration.after_pending.roles.enabled);
    const [afterPendingRolesRoles, setAfterPendingRolesRoles, resetAfterPendingRolesRoles] = useResettableState(memberJoinConfiguration.after_pending.roles.roles);

    const toObject = (): GuildConfigurationMemberJoin => ({
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
        },
        _migrated: memberJoinConfiguration._migrated
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { member_join: toObject() });

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

    const handleRollbackAction = async () => {
        setOpenMigratingBackdrop(true);

        const result = await saveGuildConfiguration(
            guild.id,
            {
                member_join: {
                    ...toObject(),
                    enabled: false,
                    _migrated: false
                }
            }
        );

        setOpenMigratingBackdrop(false);

        if (result) {
            router.refresh();
            router.push(`/dashboard/${guild.id}/welcome`);
        }
    };

    return (
        <Fragment>
            <PageHeader primary={translations.member_join} secondary={translations.member_join_description} />
            <Section>
                <SectionContent>
                    <Alert severity="warning">
                        <AlertTitle>ベータ版の機能を利用しています！</AlertTitle>
                        <Box sx={{ mb: .5 }}>
                            現在、ベータ公開中の機能を利用しています。<br />
                            この機能の利用をやめて安定版を利用するには、下のボタンを押してください。
                        </Box>
                        <Button
                            onClick={handleRollbackAction}
                            disableElevation
                            variant="contained"
                            color="inherit"
                        >
                            利用をやめる
                        </Button>
                    </Alert>
                </SectionContent>
            </Section>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.member_join_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.member_join_before_pending}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.member_join_before_pending_enabled}
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
                    {translations.member_join_message}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.member_join_before_pending_message_enabled}
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
                        secondary={translations.member_join_before_pending_message_edit_description}
                        value={beforePendingMessageMessage}
                        setValue={setBeforePendingMessageMessage}
                        disabled={!enabled || !beforePendingEnabled || !beforePendingMessageEnabled}
                        open={openBeforePendingMessageBuilder}
                        setOpen={setOpenBeforePendingMessageBuilder}
                        localization={localization}
                    >
                        <CodeStyleContainer>{translations.member_join_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle
                    variant="h6"
                    fontWeight={400}
                    color={enabled && beforePendingEnabled ? 'text.primary' : 'text.disabled'}
                >
                    {translations.member_join_roles}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.member_join_before_pending_roles_enabled}
                        checked={beforePendingRolesEnabled}
                        setChecked={setBeforePendingRolesEnabled}
                        disabled={!enabled || !beforePendingEnabled}
                    />
                    <ActionItem
                        primary={translations.member_join_manage_roles}
                        onAction={() => setOpenBeforePendingRolesDialog(true)}
                        disabled={!enabled || !beforePendingEnabled || !beforePendingRolesEnabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.member_join_after_pending}
                </SectionTitle>
                <SectionContent>
                    {!isMemberVerificationGateEnabled && <Alert severity="warning">
                        <AlertTitle>{translations.dashboard_error_cannot_be_enabled_alert_title}</AlertTitle>
                        {translations.member_join_after_pending_error_cannot_be_enabled_alert_description}
                    </Alert>}
                    <SwitchItem
                        primary={translations.member_join_after_pending_enabled}
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
                    {translations.member_join_message}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.member_join_after_pending_message_enabled}
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
                        secondary={translations.member_join_after_pending_message_edit_description}
                        value={afterPendingMessageMessage}
                        setValue={setAfterPendingMessageMessage}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled || !afterPendingMessageEnabled}
                        open={openAfterPendingMessageBuilder}
                        setOpen={setOpenAfterPendingMessageBuilder}
                        localization={localization}
                    >
                        <CodeStyleContainer>{translations.member_join_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle
                    variant="h6"
                    fontWeight={400}
                    color={enabled && afterPendingEnabled ? 'text.primary' : 'text.disabled'}
                >
                    {translations.member_join_roles}
                </SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.member_join_after_pending_roles_enabled}
                        checked={afterPendingRolesEnabled}
                        setChecked={setAfterPendingRolesEnabled}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled}
                    />
                    <ActionItem
                        primary={translations.member_join_manage_roles}
                        onAction={() => setOpenAfterPendingRolesDialog(true)}
                        disabled={!enabled || !isMemberVerificationGateEnabled || !afterPendingEnabled || !afterPendingRolesEnabled}
                    />
                </SectionContent>
            </Section>

            <Backdrop open={openMigratingBackdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

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

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={memberJoinConfiguration}
                target={toObject()}
                schema={GuildConfigurationMemberJoinSchema}
                disableKeyboardShortcuts={openBeforePendingMessageBuilder || openBeforePendingRolesDialog || openAfterPendingMessageBuilder || openAfterPendingRolesDialog}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
