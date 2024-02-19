'use client';

import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '@components/dialog';
import {
    ActionItem,
    ChannelItem,
    LinkItem,
    MessageItem,
    NumberFieldItem,
    RadioItem,
    RouteLinkItem,
    SelectItem,
    SwitchItem,
    TextFieldItem
} from '@components/items';
import { PageHeader } from '@components/layout_v2';
import { SaveConfirmV2 } from '@components/save_confirm_v2';
import { CodeStyleContainer } from '@components/text';
import {
    GuildConfigurationLevel,
    GuildConfigurationLevelNotificationType,
    GuildConfigurationLevelRewardType
} from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent, SectionParagraph, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { GuildConfigurationLevelSchema } from '@schemas/bot';
import { ChannelType } from 'discord-api-types/v10';
import uniqBy from 'lodash/uniqBy';
import React, { Fragment, useEffect, useState } from 'react';
import { saveGuildConfiguration } from '../utils';
import { ManageRolesDialog } from './dialog';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [openDisabledChannelsDialog, setOpenDisabledChannelsDialog] = useState(false);
    const [openDisabledRolesDialog, setOpenDisabledRolesDialog] = useState(false);
    const [openRolesDialog, setOpenRolesDialog] = useState(false);
    const [openMessageBuilder, setOpenMessageBuilder] = useState(false);

    const [origin, setOrigin] = useState('');

    const levelConfiguration = configuration.level;
    const [enabled, setEnabled, resetEnabled] = useResettableState(levelConfiguration.enabled);
    const [experiencePerMessage, setExperiencePerMessage, resetExperiencePerMessage] = useResettableState(levelConfiguration.experience_per_message);
    const [disabledChannels, setDisabledChannels, resetDisabledChannels] = useResettableState(levelConfiguration.disabled.channels);
    const [disabledRoles, setDisabledRoles, resetDisabledRoles] = useResettableState(levelConfiguration.disabled.roles);
    const [rewardType, setRewardType, resetRewardType] = useResettableState(levelConfiguration.reward.type);
    const [rewardRemoveRoleDemoted, setRewardRemoveRoleDemoted, resetRewardRemoveRoleDemoted] = useResettableState(levelConfiguration.reward.remove_role_demoted);
    const [rewardRoles, setRewardRoles, resetRewardRoles] = useResettableState(uniqBy(levelConfiguration.reward.roles, (role) => `${role.level}_${role.id}`));
    const [notificationType, setNotificationType, resetNotificationType] = useResettableState(levelConfiguration.notification.type);
    const [notificationChannelId, setNotificationChannelId, resetNotificationChannelId] = useResettableState(levelConfiguration.notification.channel_id);
    const [notificationMessage, setNotificationMessage, resetNotificationMessage] = useResettableState(levelConfiguration.notification.message);
    const [leaderboardPublic, setLeaderboardPublic, resetLeaderboardPublic] = useResettableState(levelConfiguration.leaderboard.public);
    const [leaderboardAllowJoin, setLeaderboardAllowJoin, resetLeaderboardAllowJoin] = useResettableState(levelConfiguration.leaderboard.allow_join);
    const [leaderboardVanityCode, setLeaderboardVanityCode, resetLeaderboardVanityCode] = useResettableState(levelConfiguration.leaderboard.vanity_code ?? '');

    useEffect(() => setOrigin(window.location.origin), []);

    const toObject = (): GuildConfigurationLevel => ({
        enabled,
        experience_per_message: experiencePerMessage,
        disabled: {
            channels: disabledChannels,
            roles: disabledRoles
        },
        reward: {
            type: rewardType,
            remove_role_demoted: rewardRemoveRoleDemoted,
            roles: uniqBy(rewardRoles, (role) => `${role.level}_${role.id}`)
        },
        notification: {
            type: notificationType,
            channel_id: notificationChannelId,
            message: notificationMessage
        },
        leaderboard: {
            public: leaderboardPublic,
            allow_join: leaderboardAllowJoin,
            vanity_code: leaderboardVanityCode && leaderboardVanityCode.length > 0 ? leaderboardVanityCode : null
        }
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { level: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetExperiencePerMessage();
        resetDisabledChannels();
        resetDisabledRoles();
        resetRewardType();
        resetRewardRemoveRoleDemoted();
        resetRewardRoles();
        resetNotificationType();
        resetNotificationChannelId();
        resetNotificationMessage();
        resetLeaderboardPublic();
        resetLeaderboardAllowJoin();
        resetLeaderboardVanityCode();
    };

    return (
        <Fragment>
            <PageHeader primary={translations.level} secondary={translations.level_description} />
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.level_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <NumberFieldItem
                        primary={translations.level_experience_per_message}
                        value={experiencePerMessage}
                        setValue={setExperiencePerMessage}
                        pattern="\d*"
                        step={1}
                        min={1}
                        disabled={!enabled}
                    />
                    <RouteLinkItem
                        primary={translations.level_manage}
                        href={`/dashboard/${guild.id}/level/manage`}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_channels}
                        secondary={translations.level_manage_disabled_channels_description}
                        onAction={() => setOpenDisabledChannelsDialog(true)}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_roles}
                        secondary={translations.level_manage_disabled_roles_description}
                        onAction={() => setOpenDisabledRolesDialog(true)}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.level_reward}
                </SectionTitle>
                <SectionContent>
                    <SectionParagraph variant="h6" fontWeight={400} color={enabled ? 'text.primary' : 'text.disabled'}>
                        {translations.level_reward_type}
                    </SectionParagraph>
                    <RadioItem<GuildConfigurationLevelRewardType>
                        primary={translations.level_reward_type_stack}
                        secondary={translations.level_reward_type_stack_description}
                        name="reward_type"
                        value="STACK_PREVIOUS_ROLES"
                        selected={rewardType}
                        setSelected={setRewardType}
                        disabled={!enabled}
                    />
                    <RadioItem<GuildConfigurationLevelRewardType>
                        primary={translations.level_reward_type_replace}
                        secondary={translations.level_reward_type_replace_description}
                        name="reward_type"
                        value="REMOVE_PREVIOUS_ROLES"
                        selected={rewardType}
                        setSelected={setRewardType}
                        disabled={!enabled}
                    />
                </SectionContent>
                <SectionContent>
                    <SwitchItem
                        primary={translations.level_reward_remove_role_demoted}
                        checked={rewardRemoveRoleDemoted}
                        setChecked={setRewardRemoveRoleDemoted}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.level_reward_manage_roles}
                        onAction={() => setOpenRolesDialog(true)}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.level_notification}
                </SectionTitle>
                <SectionContent>
                    <SelectItem<GuildConfigurationLevelNotificationType>
                        primary={translations.level_notification_type}
                        value={notificationType}
                        setValue={setNotificationType}
                        choices={[
                            { value: 'DISABLED', children: translations.level_notification_type_disabled },
                            {
                                value: 'DIRECT_MESSAGE',
                                children: translations.level_notification_type_direct_message
                            },
                            {
                                value: 'CURRENT_CHANNEL',
                                children: translations.level_notification_type_latest_channel
                            },
                            {
                                value: 'CUSTOM_CHANNEL',
                                children: translations.level_notification_type_custom_channel
                            }
                        ]}
                        disabled={!enabled}
                    />
                    <ChannelItem
                        primary={translations.level_notification_channel}
                        value={notificationChannelId}
                        setValue={setNotificationChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled || notificationType !== 'CUSTOM_CHANNEL'}
                        localization={localization}
                    />
                    <MessageItem
                        primary={translations.customize_message}
                        secondary={translations.level_notification_edit_description}
                        value={notificationMessage}
                        setValue={setNotificationMessage}
                        disabled={!enabled || notificationType === 'DISABLED'}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                        localization={localization}
                    >
                        <CodeStyleContainer>{translations.level_notification_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.level_leaderboard}
                </SectionTitle>
                <SectionContent>
                    <LinkItem
                        primary={translations.level_leaderboard_view}
                        href={`/leaderboard/${guild.id}`}
                        target="_blank"
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.level_leaderboard_public}
                        checked={leaderboardPublic}
                        setChecked={setLeaderboardPublic}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.level_leaderboard_allow_join}
                        checked={leaderboardAllowJoin}
                        setChecked={setLeaderboardAllowJoin}
                        disabled={!enabled || !leaderboardPublic}
                    />
                    <TextFieldItem
                        primary={translations.level_leaderboard_vanity_code}
                        secondary={`${origin}/leaderboard/${leaderboardVanityCode && leaderboardVanityCode.length > 0 ? leaderboardVanityCode : guild.id}`}
                        secondaryTypographyProps={{
                            sx: {
                                wordBreak: 'break-all'
                            }
                        }}
                        value={leaderboardVanityCode}
                        setValue={setLeaderboardVanityCode}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>

            <ManageDisabledChannelsDialog
                open={openDisabledChannelsDialog}
                setOpen={setOpenDisabledChannelsDialog}
                value={disabledChannels}
                setValue={setDisabledChannels}
                channels={guild.channels}
                localization={localization}
            />
            <ManageDisabledRolesDialog
                open={openDisabledRolesDialog}
                setOpen={setOpenDisabledRolesDialog}
                value={disabledRoles}
                setValue={setDisabledRoles}
                roles={guild.roles}
                localization={localization}
            />
            <ManageRolesDialog
                open={openRolesDialog}
                setOpen={setOpenRolesDialog}
                value={rewardRoles}
                setValue={setRewardRoles}
                guild={guild}
                localization={localization}
            />

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={levelConfiguration}
                target={toObject()}
                schema={GuildConfigurationLevelSchema}
                disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog || openRolesDialog || openMessageBuilder}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
