'use client';

import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '@/components/dialog';
import { OpenInNewIcon } from '@/components/icons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { SectionChannelSelectCard, SectionMessageCard } from '@/components/section_card';
import { CodeStyleContainer } from '@/components/text';
import {
    GuildConfigurationLevel,
    GuildConfigurationLevelNotificationType,
    GuildConfigurationLevelRewardType
} from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationLevelSchema } from '@/schemas/bot';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import {
    SectionAccordionCard,
    sectionAccordionCardClasses,
    SectionButtonActionCard,
    sectionCardClasses,
    sectionCardDisplayClasses,
    SectionNumberFieldCard,
    SectionRadioCard,
    SectionRouteLinkCard,
    SectionSelectCard,
    SectionSwitchCard,
    SectionTextFieldCard
} from '@lunaproject/web-core/dist/components/SectionCard';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { Box, switchClasses, Typography } from '@mui/material';
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
                    <SectionSwitchCard
                        primary={translations.level_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SectionNumberFieldCard
                        primary={translations.level_experience_per_message}
                        value={experiencePerMessage}
                        setValue={setExperiencePerMessage}
                        disabled={!enabled}
                        slotProps={{
                            control: {
                                min: 1
                            }
                        }}
                    />
                    <SectionRouteLinkCard
                        primary={translations.level_manage}
                        href={`/dashboard/${guild.id}/level/manage`}
                        disabled={!enabled}
                    />
                    <SectionButtonActionCard
                        primary={translations.manage_disabled_channels}
                        secondary={translations.level_manage_disabled_channels_description}
                        onClick={() => setOpenDisabledChannelsDialog(true)}
                        disabled={!enabled}
                    />
                    <SectionButtonActionCard
                        primary={translations.manage_disabled_roles}
                        secondary={translations.level_manage_disabled_roles_description}
                        onClick={() => setOpenDisabledRolesDialog(true)}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.level_reward}
                </SectionTitle>
                <SectionContent>
                    <SectionAccordionCard
                        primary={translations.level_reward_type}
                        headerChildren={
                            <Typography variant="body2" color="text.secondary" sx={{ mt: .25 }}>
                                {rewardType === 'STACK_PREVIOUS_ROLES' ? translations.level_reward_type_stack : translations.level_reward_type_replace}
                            </Typography>
                        }
                        readOnly={!enabled}
                        sx={{
                            [`&.${sectionAccordionCardClasses.readOnly} .${sectionAccordionCardClasses.header}`]: {
                                [[
                                    `& .${sectionCardDisplayClasses.root} *`,
                                    `& .${sectionCardDisplayClasses.icon} *`,
                                    `& .${sectionCardDisplayClasses.primary} *`,
                                    `& .${sectionCardDisplayClasses.secondary} *`,
                                    `& .${sectionCardClasses.content} *:not(.${switchClasses.root} *)`
                                ].join(',')]: {
                                    color: 'action.disabled'
                                }
                            }
                        }}
                    >
                        <SectionRadioCard<GuildConfigurationLevelRewardType>
                            primary={translations.level_reward_type_stack}
                            secondary={translations.level_reward_type_stack_description}
                            name="reward_type"
                            value="STACK_PREVIOUS_ROLES"
                            selected={rewardType}
                            setSelected={setRewardType}
                        />
                        <SectionRadioCard<GuildConfigurationLevelRewardType>
                            primary={translations.level_reward_type_replace}
                            secondary={translations.level_reward_type_replace_description}
                            name="reward_type"
                            value="REMOVE_PREVIOUS_ROLES"
                            selected={rewardType}
                            setSelected={setRewardType}
                        />
                    </SectionAccordionCard>
                    <SectionSwitchCard
                        primary={translations.level_reward_remove_role_demoted}
                        checked={rewardRemoveRoleDemoted}
                        setChecked={setRewardRemoveRoleDemoted}
                        disabled={!enabled}
                    />
                    <SectionButtonActionCard
                        primary={translations.level_reward_manage_roles}
                        onClick={() => setOpenRolesDialog(true)}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.level_notification}
                </SectionTitle>
                <SectionContent>
                    <SectionSelectCard<GuildConfigurationLevelNotificationType>
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
                    <SectionChannelSelectCard
                        primary={translations.level_notification_channel}
                        value={notificationChannelId}
                        setValue={setNotificationChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled || notificationType !== 'CUSTOM_CHANNEL'}
                        localization={localization}
                    />
                    <SectionMessageCard
                        primary={translations.customize_message}
                        secondary={translations.level_notification_edit_description}
                        value={notificationMessage}
                        setValue={setNotificationMessage}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                        disabled={!enabled || notificationType === 'DISABLED'}
                        localization={localization}
                    >
                        <CodeStyleContainer>
                            {translations.level_notification_edit_hint}
                        </CodeStyleContainer>
                    </SectionMessageCard>
                </SectionContent>
            </Section>
            <Section>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row'
                        },
                        alignItems: {
                            xs: 'stretch',
                            sm: 'center'
                        },
                        justifyContent: {
                            xs: 'center',
                            sm: 'space-between'
                        },
                        columnGap: 1,
                        rowGap: .5
                    }}
                >
                    <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                        {translations.level_leaderboard}
                    </SectionTitle>
                    <Button
                        component="a"
                        href={`/leaderboard/${guild.id}`}
                        target="_blank"
                        disabled={!enabled}
                        variant="outlined"
                        corners="extended"
                        endIcon={<OpenInNewIcon color={enabled ? 'action' : 'disabled'} />}
                    >
                        {translations.level_leaderboard_view}
                    </Button>
                </Box>
                <SectionContent>
                    <SectionSwitchCard
                        primary={translations.level_leaderboard_public}
                        checked={leaderboardPublic}
                        setChecked={setLeaderboardPublic}
                        disabled={!enabled}
                    />
                    <SectionSwitchCard
                        primary={translations.level_leaderboard_allow_join}
                        checked={leaderboardAllowJoin}
                        setChecked={setLeaderboardAllowJoin}
                        disabled={!enabled || !leaderboardPublic}
                    />
                    <SectionTextFieldCard
                        primary={translations.level_leaderboard_vanity_code}
                        secondary={`${origin}/leaderboard/${leaderboardVanityCode && leaderboardVanityCode.length > 0 ? leaderboardVanityCode : guild.id}`}
                        value={leaderboardVanityCode}
                        setValue={setLeaderboardVanityCode}
                        disabled={!enabled}
                        slotProps={{
                            display: {
                                secondary: {
                                    sx: {
                                        wordBreak: 'break-all'
                                    }
                                }
                            }
                        }}
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
