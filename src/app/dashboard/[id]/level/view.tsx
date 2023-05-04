'use client';

import {
    Section,
    SectionContent,
    SectionParagraph,
    SectionTitle
} from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { APIGuildChannel } from '@lunaproject-discord/web-discord/dist/interfaces';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { APIRole, ChannelType } from 'discord-api-types/v10';
import React, { Fragment, MouseEvent, useEffect, useState } from 'react';
import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '../../../../components/dialog';
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
} from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { CodeStyleContainer } from '../../../../components/text';
import {
    GuildSettingsLevel,
    GuildSettingsLevelNotificationType,
    GuildSettingsLevelRewardRole,
    GuildSettingsLevelRewardType
} from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';
import { ManageRolesDialog } from './manage_roles';

interface Props extends GuildSettingsViewProps {
    channels: APIGuildChannel[];
    roles: APIRole[];
}

export const View = ({ guild, settings, localization }: GuildSettingsViewProps) => {
    const { translations } = localization;

    const [openDisabledChannelsDialog, setOpenDisabledChannelsDialog] = useState(false);
    const [openDisabledRolesDialog, setOpenDisabledRolesDialog] = useState(false);
    const [openRolesDialog, setOpenRolesDialog] = useState(false);
    const [openMessageBuilder, setOpenMessageBuilder] = useState(false);

    const [origin, setOrigin] = useState('');

    const level = settings.level;
    const [enabled, setEnabled, resetEnabled] = useResettableState(level.enabled);
    const [experiencePerMessage, setExperiencePerMessage, resetExperiencePerMessage] = useResettableState(level.experience_per_message);
    const [rewardType, setRewardType, resetRewardType] = useResettableState(level.reward.type);
    const [rewardRemoveRoleDemoted, setRewardRemoveRoleDemoted, resetRewardRemoveRoleDemoted] = useResettableState(level.reward.remove_role_demoted);
    const [notificationType, setNotificationType, resetNotificationType] = useResettableState(level.notification.type);
    const [notificationChannelId, setNotificationChannelId, resetNotificationChannelId] = useResettableState(level.notification.channel_id);
    const [notificationMessage, setNotificationMessage, resetNotificationMessage] = useResettableState(level.notification.message);
    const [leaderboardPublic, setLeaderboardPublic, resetLeaderboardPublic] = useResettableState(level.leaderboard.public);
    const [leaderboardAllowJoin, setLeaderboardAllowJoin, resetLeaderboardAllowJoin] = useResettableState(level.leaderboard.allow_join);
    const [leaderboardVanityCode, setLeaderboardVanityCode, resetLeaderboardVanityCode] = useResettableState(level.leaderboard.vanity_code);

    useEffect(() => setOrigin(window.location.origin), []);

    const toObject = (): GuildSettingsLevel => ({
        enabled,
        experience_per_message: experiencePerMessage,
        disabled: level.disabled,
        reward: {
            type: rewardType,
            remove_role_demoted: rewardRemoveRoleDemoted,
            roles: level.reward.roles
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

    const handleClickDisabledChannelsDialogSaveButton = (e: MouseEvent<HTMLButtonElement>, channels: string[]) => saveGuildSettings(
        guild.id,
        {
            level: {
                ...level,
                disabled: {
                    ...level.disabled,
                    channels
                },
                reward: level.reward,
                notification: level.notification,
                leaderboard: level.leaderboard
            }
        }
    );

    const handleClickDisabledRolesDialogSaveButton = (e: MouseEvent<HTMLButtonElement>, roles: string[]) => saveGuildSettings(
        guild.id,
        {
            level: {
                ...level,
                disabled: {
                    ...level.disabled,
                    roles
                },
                reward: level.reward,
                notification: level.notification,
                leaderboard: level.leaderboard
            }
        }
    );

    const handleClickRolesDialogSaveButton = (e: MouseEvent<HTMLButtonElement>, roles: GuildSettingsLevelRewardRole[]) => saveGuildSettings(
        guild.id,
        {
            level: {
                ...level,
                disabled: level.disabled,
                reward: {
                    ...level.reward,
                    roles
                },
                notification: level.notification,
                leaderboard: level.leaderboard
            }
        }
    );

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            level: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
        resetExperiencePerMessage();
        resetRewardType();
        resetRewardRemoveRoleDemoted();
        resetNotificationType();
        resetNotificationChannelId();
        resetNotificationMessage();
        resetLeaderboardPublic();
        resetLeaderboardAllowJoin();
        resetLeaderboardVanityCode();
    };

    return (
        <Fragment>
            <PageContent>
                <PageHeader>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                        <Typography variant="h4">{translations.level}</Typography>
                        <Typography variant="body1">{translations.level_description}</Typography>
                    </Box>
                </PageHeader>
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
                    <SectionTitle>{translations.level_reward}</SectionTitle>
                    <SectionContent>
                        <SectionParagraph variant="h6"
                                          fontWeight={400}>{translations.level_reward_type}</SectionParagraph>
                        <RadioItem<GuildSettingsLevelRewardType>
                            primary={translations.level_reward_type_stack}
                            secondary={translations.level_reward_type_stack_description}
                            name="reward_type"
                            value="STACK_PREVIOUS_ROLES"
                            selected={rewardType}
                            setSelected={setRewardType}
                            disabled={!enabled}
                        />
                        <RadioItem<GuildSettingsLevelRewardType>
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
                    <SectionTitle>{translations.level_notification}</SectionTitle>
                    <SectionContent>
                        <SelectItem<GuildSettingsLevelNotificationType>
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
                        />
                        <MessageItem
                            primary={translations.customize_message}
                            secondary={translations.level_notification_edit_description}
                            value={notificationMessage}
                            setValue={setNotificationMessage}
                            disabled={!enabled}
                            open={openMessageBuilder}
                            setOpen={setOpenMessageBuilder}
                            localization={localization}
                        >
                            <CodeStyleContainer>{translations.level_notification_edit_hint}</CodeStyleContainer>
                        </MessageItem>
                    </SectionContent>
                </Section>
                <Section>
                    <SectionTitle>{translations.level_leaderboard}</SectionTitle>
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
                            secondary={<Fragment>
                                {origin}/leaderboard/{leaderboardVanityCode && leaderboardVanityCode.length > 0 ? leaderboardVanityCode : guild.id}
                            </Fragment>}
                            value={leaderboardVanityCode ?? ''}
                            setValue={setLeaderboardVanityCode}
                            disabled={!enabled}
                        />
                    </SectionContent>
                </Section>

                <SaveConfirm
                    open={!deepEqual(level, toObject(), { strict: true })}
                    disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog || openMessageBuilder}
                    onSave={handleActionSave}
                    onCancel={handleActionCancel}
                />
            </PageContent>

            <ManageDisabledChannelsDialog
                open={openDisabledChannelsDialog}
                onClose={() => setOpenDisabledChannelsDialog(false)}
                choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildStageVoice)}
                values={level.disabled.channels}
                onClickSaveButton={handleClickDisabledChannelsDialogSaveButton}
                localization={localization}
            />
            <ManageDisabledRolesDialog
                open={openDisabledRolesDialog}
                onClose={() => setOpenDisabledRolesDialog(false)}
                choices={guild.roles}
                values={level.disabled.roles}
                onClickSaveButton={handleClickDisabledRolesDialogSaveButton}
                localization={localization}
            />
            <ManageRolesDialog
                open={openRolesDialog}
                onClose={() => setOpenRolesDialog(false)}
                choices={guild.roles}
                initialValues={level.reward.roles}
                onClickSaveButton={handleClickRolesDialogSaveButton}
                localization={localization}
            />
        </Fragment>
    );
};
