import {
    SectionChannelSelectCard as OriginalSectionChannelSelectCard,
    sectionChannelSelectCardClasses,
    SectionChannelSelectCardProps
} from '@/components/section_card';
import {
    GuildConfigurationLoggingChannel,
    GuildConfigurationLoggingMember,
    GuildConfigurationLoggingMessage,
    GuildConfigurationLoggingModeration,
    GuildConfigurationLoggingObject,
    GuildConfigurationLoggingRoot,
    GuildConfigurationLoggingVoice
} from '@/interfaces/bot';
import { GuildChannelsViewProps } from '@/interfaces/view';
import {
    Section as LPSection,
    SectionContent as LPSectionContent
} from '@lunaproject/web-core/dist/components/Section';
import {
    sectionCardClasses,
    SectionCardDisabledProps,
    SectionCardVariableProps,
    SectionSwitchCard
} from '@lunaproject/web-core/dist/components/SectionCard';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Box, styled } from '@mui/material';
import React, { ReactNode } from 'react';

export const GridContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 0, 0),
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr'
    }
}));

const Section = styled(LPSection)(({ theme }) => ({
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    border: `solid 1px ${theme.vars.palette.divider}`,
    borderRadius: theme.shape.borderRadius
}));

const SectionContent = styled(LPSectionContent)(({ theme }) => ({
    gap: 0,
    [`& .${sectionCardClasses.root}`]: {
        minHeight: theme.spacing(7),
        borderTop: `solid 1px ${theme.vars.palette.divider} !important`,
        borderRadius: 0
    },
    [`& .${sectionCardClasses.root}:last-child`]: {
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius
    }
}));

interface SectionHeaderProps extends SectionCardVariableProps<{ enabled: boolean; }>, SectionCardDisabledProps {
    label: ReactNode;
}

const SectionHeader = ({ label, enabled, setEnabled, disabled }: SectionHeaderProps) => (
    <SectionSwitchCard
        primary={label}
        checked={enabled}
        setChecked={setEnabled}
        disabled={disabled}
        slotProps={{
            display: {
                primary: {
                    sx: (theme) => ({
                        ...theme.typography.h6
                    })
                }
            }
        }}
        sx={{
            borderRadius: 0,
            borderTopLeftRadius: (theme) => theme.shape.borderRadius,
            borderTopRightRadius: (theme) => theme.shape.borderRadius
        }}
    />
);

const SectionChannelSelectCard = (props: SectionChannelSelectCardProps) => (
    <Box
        sx={(theme) => ({
            containerType: 'inline-size',
            // アイテムのラベル: 200px, チャンネルのセレクトボックス: 300px, パディングとギャップ: 8 * 1.5 * 3
            [theme.containerQueries.down(200 + 300 + ((8 * 1.5) * 3))]: {
                [`& > .${sectionChannelSelectCardClasses.root}`]: {
                    flexWrap: 'wrap',
                    [`& .${sectionCardClasses.content}, & .${sectionCardClasses.content} .${sectionChannelSelectCardClasses.control}`]: {
                        width: '100%'
                    }
                }
            }
        })}
    >
        <OriginalSectionChannelSelectCard {...props} />
    </Box>
);

type SectionProps<T extends GuildConfigurationLoggingRoot> =
    SectionCardVariableProps<{ value: T; }>
    & SectionCardDisabledProps
    & GuildChannelsViewProps;

export const Moderation = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingModeration>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_moderation}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={translations.logging_moderation_update}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_moderation_kick}
                    checked={value.kick}
                    setChecked={(checked) => setValue({
                        ...value,
                        kick: getStateActionValue(checked, value.kick)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_moderation_prune}
                    checked={value.prune}
                    setChecked={(checked) => setValue({
                        ...value,
                        prune: getStateActionValue(checked, value.prune)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_moderation_ban}
                    checked={value.ban}
                    setChecked={(checked) => setValue({
                        ...value,
                        ban: getStateActionValue(checked, value.ban)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_moderation_unban}
                    checked={value.unban}
                    setChecked={(checked) => setValue({
                        ...value,
                        unban: getStateActionValue(checked, value.unban)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Member = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingMember>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_member}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={translations.logging_member_join}
                    checked={value.join}
                    setChecked={(checked) => setValue({
                        ...value,
                        join: getStateActionValue(checked, value.join)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_member_leave}
                    checked={value.leave}
                    setChecked={(checked) => setValue({
                        ...value,
                        leave: getStateActionValue(checked, value.leave)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_member_update}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_member_role_add}
                    checked={value.role_add}
                    setChecked={(checked) => setValue({
                        ...value,
                        role_add: getStateActionValue(checked, value.role_add)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_member_role_remove}
                    checked={value.role_remove}
                    setChecked={(checked) => setValue({
                        ...value,
                        role_remove: getStateActionValue(checked, value.role_remove)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Voice = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingVoice>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_voice}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={translations.logging_voice_join}
                    checked={value.join}
                    setChecked={(checked) => setValue({
                        ...value,
                        join: getStateActionValue(checked, value.join)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_voice_leave}
                    checked={value.leave}
                    setChecked={(checked) => setValue({
                        ...value,
                        leave: getStateActionValue(checked, value.leave)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_voice_move}
                    checked={value.move}
                    setChecked={(checked) => setValue({
                        ...value,
                        move: getStateActionValue(checked, value.move)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_voice_mute}
                    checked={value.mute}
                    setChecked={(checked) => setValue({
                        ...value,
                        mute: getStateActionValue(checked, value.mute)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_voice_deafen}
                    checked={value.deafen}
                    setChecked={(checked) => setValue({
                        ...value,
                        deafen: getStateActionValue(checked, value.deafen)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Category = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingChannel>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_category}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_category))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_category))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_category))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_channel_permission_update}
                    checked={value.permissions_update}
                    setChecked={(checked) => setValue({
                        ...value,
                        permissions_update: getStateActionValue(checked, value.permissions_update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const TextChannel = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingChannel>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_text_channel}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_text_channel))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_text_channel))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_text_channel))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_channel_permission_update}
                    checked={value.permissions_update}
                    setChecked={(checked) => setValue({
                        ...value,
                        permissions_update: getStateActionValue(checked, value.permissions_update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const VoiceChannel = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingChannel>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_voice_channel}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_voice_channel))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_voice_channel))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_voice_channel))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_channel_permission_update}
                    checked={value.permissions_update}
                    setChecked={(checked) => setValue({
                        ...value,
                        permissions_update: getStateActionValue(checked, value.permissions_update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Role = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_role}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_role))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_role))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_role))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Emote = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_emote}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_emote))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_emote))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_emote))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Invite = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_invite}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_invite))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_invite))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_invite))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Webhook = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_webhook}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_webhook))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_webhook))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_webhook))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Integration = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_integration}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_integration))}
                    checked={value.create}
                    setChecked={(checked) => setValue({
                        ...value,
                        create: getStateActionValue(checked, value.create)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_integration))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_integration))}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};

export const Message = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: SectionProps<GuildConfigurationLoggingMessage>
) => {
    const { translations } = localization;

    return (
        <Section>
            <SectionHeader
                label={translations.logging_message}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({
                    ...value,
                    enabled: getStateActionValue(enabled, value.enabled)
                })}
                disabled={disabled}
            />
            <SectionContent>
                <SectionChannelSelectCard
                    primary={translations.logging_channel}
                    value={value.channel_id}
                    setValue={(action) => setValue({
                        ...value,
                        channel_id: getStateActionValue(action, value.channel_id)
                    })}
                    choices={channels}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                />
                <SectionSwitchCard
                    primary={translations.logging_message_update}
                    checked={value.update}
                    setChecked={(checked) => setValue({
                        ...value,
                        update: getStateActionValue(checked, value.update)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_message_delete}
                    checked={value.delete}
                    setChecked={(checked) => setValue({
                        ...value,
                        delete: getStateActionValue(checked, value.delete)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_message_purge}
                    checked={value.purge}
                    setChecked={(checked) => setValue({
                        ...value,
                        purge: getStateActionValue(checked, value.purge)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_message_pin}
                    checked={value.pin}
                    setChecked={(checked) => setValue({
                        ...value,
                        pin: getStateActionValue(checked, value.pin)
                    })}
                    disabled={disabled || !value.enabled}
                />
                <SectionSwitchCard
                    primary={translations.logging_message_unpin}
                    checked={value.unpin}
                    setChecked={(checked) => setValue({
                        ...value,
                        unpin: getStateActionValue(checked, value.unpin)
                    })}
                    disabled={disabled || !value.enabled}
                />
            </SectionContent>
        </Section>
    );
};
