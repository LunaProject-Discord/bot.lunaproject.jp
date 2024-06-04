import {
    ButtonItemRoot,
    ChannelItem as OriginalChannelItem,
    ChannelItemProps,
    ItemDisabledProps,
    ItemFormContainer,
    ItemRowContainer,
    ItemVariableProps,
    sectionItemClasses,
    SwitchItem
} from '@/components/items';
import {
    GuildConfigurationLoggingChannel,
    GuildConfigurationLoggingMember,
    GuildConfigurationLoggingMessage,
    GuildConfigurationLoggingModeration,
    GuildConfigurationLoggingObject,
    GuildConfigurationLoggingRoot,
    GuildConfigurationLoggingVoice
} from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { RedisChannel } from '@/interfaces/redis';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Box, buttonBaseClasses, Paper, styled, Switch, switchClasses, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

export const GridContainer = styled(Section)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr'
    }
}));

const ItemContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'none',
    border: `solid 1px ${theme.palette.divider}`,
    boxShadow: 'none'
}));

const ItemContent = styled(SectionContent)(({ theme }) => ({
    [`& .${buttonBaseClasses.root}`]: {
        borderRadius: 0
    },
    [`& .${buttonBaseClasses.root}:last-child`]: {
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius
    }
}));

interface ItemHeaderProps extends ItemDisabledProps {
    label: ReactNode;
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const ItemHeader = ({ label, enabled, setEnabled, disabled }: ItemHeaderProps) => (
    <ButtonItemRoot
        onClick={() => setEnabled(!enabled)}
        disabled={disabled}
        sx={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        }}
    >
        <ItemRowContainer>
            <Typography variant="h6" align="left" sx={{ width: '100%' }}>{label}</Typography>
            <ItemFormContainer sx={{ mr: -.75 }}>
                <Switch
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                    disabled={disabled}
                    disableRipple
                    tabIndex={-1}
                    sx={{ [`& .${switchClasses.switchBase}`]: { backgroundColor: 'transparent !important' } }}
                />
            </ItemFormContainer>
        </ItemRowContainer>
    </ButtonItemRoot>
);

const ChannelItem = (props: ChannelItemProps) => (
    <Box
        sx={(theme) => ({
            containerType: 'inline-size',
            // アイテムのラベル: 200px, チャンネルのセレクトボックス: 300px, パディングとギャップ: 8 * 1.5 * 3
            [`@container (max-width: ${(200 + 300 + ((8 * 1.5) * 3)) - .05}px)`]: {
                [`& > .${sectionItemClasses.root}`]: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    [`& > :not(.${sectionItemClasses.formContainer})`]: {
                        height: 'auto',
                        minHeight: 'auto',
                        pt: 1.5
                    },
                    [`& > .${sectionItemClasses.formContainer}, & > .${sectionItemClasses.formContainer} > div`]: {
                        width: '100%'
                    }
                }
            }
        })}
    >
        <OriginalChannelItem {...props} />
    </Box>
);

interface Props<T extends GuildConfigurationLoggingRoot> extends ItemDisabledProps, ItemVariableProps<T>, LocalizationProps {
    channels: RedisChannel[];
}

export const Moderation = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingModeration>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_moderation}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={translations.logging_moderation_update}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_moderation_kick}
                    checked={value.kick}
                    setChecked={(checked) => setValue({ ...value, kick: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_moderation_prune}
                    checked={value.prune}
                    setChecked={(checked) => setValue({ ...value, prune: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_moderation_ban}
                    checked={value.ban}
                    setChecked={(checked) => setValue({ ...value, ban: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_moderation_unban}
                    checked={value.unban}
                    setChecked={(checked) => setValue({ ...value, unban: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Member = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingMember>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_member}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={translations.logging_member_join}
                    checked={value.join}
                    setChecked={(checked) => setValue({ ...value, join: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_member_leave}
                    checked={value.leave}
                    setChecked={(checked) => setValue({ ...value, leave: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_member_update}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_member_role_add}
                    checked={value.role_add}
                    setChecked={(checked) => setValue({ ...value, role_add: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_member_role_remove}
                    checked={value.role_remove}
                    setChecked={(checked) => setValue({ ...value, role_remove: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Voice = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingVoice>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_voice}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={translations.logging_voice_join}
                    checked={value.join}
                    setChecked={(checked) => setValue({ ...value, join: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_voice_leave}
                    checked={value.leave}
                    setChecked={(checked) => setValue({ ...value, leave: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_voice_move}
                    checked={value.move}
                    setChecked={(checked) => setValue({ ...value, move: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_voice_mute}
                    checked={value.mute}
                    setChecked={(checked) => setValue({ ...value, mute: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_voice_deafen}
                    checked={value.deafen}
                    setChecked={(checked) => setValue({ ...value, deafen: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Category = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingChannel>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_category}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_category))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_category))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_category))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_channel_permission_update}
                    checked={value.permissions_update}
                    setChecked={(checked) => setValue({ ...value, permissions_update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const TextChannel = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingChannel>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_text_channel}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_text_channel))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_text_channel))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_text_channel))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_channel_permission_update}
                    checked={value.permissions_update}
                    setChecked={(checked) => setValue({ ...value, permissions_update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const VoiceChannel = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingChannel>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_voice_channel}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_voice_channel))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_voice_channel))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_voice_channel))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_channel_permission_update}
                    checked={value.permissions_update}
                    setChecked={(checked) => setValue({ ...value, permissions_update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Role = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_role}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_role))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_role))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_role))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Emote = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_emote}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_emote))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_emote))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_emote))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Invite = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_invite}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_invite))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_invite))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_invite))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Webhook = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_webhook}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_webhook))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_webhook))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_webhook))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Integration = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingObject>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_integration}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={String(translations.logging_object_create).replace('%n', String(translations.logging_integration))}
                    checked={value.create}
                    setChecked={(checked) => setValue({ ...value, create: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_delete).replace('%n', String(translations.logging_integration))}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={String(translations.logging_object_update).replace('%n', String(translations.logging_integration))}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};

export const Message = (
    {
        value,
        setValue,
        channels,
        disabled,
        localization
    }: Props<GuildConfigurationLoggingMessage>
) => {
    const { translations } = localization;

    return (
        <ItemContainer>
            <ItemHeader
                label={translations.logging_message}
                enabled={value.enabled}
                setEnabled={(enabled) => setValue({ ...value, enabled })}
                disabled={disabled}
            />
            <ItemContent>
                <ChannelItem
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
                <SwitchItem
                    primary={translations.logging_message_update}
                    checked={value.update}
                    setChecked={(checked) => setValue({ ...value, update: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_message_delete}
                    checked={value.delete}
                    setChecked={(checked) => setValue({ ...value, delete: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_message_purge}
                    checked={value.purge}
                    setChecked={(checked) => setValue({ ...value, purge: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_message_pin}
                    checked={value.pin}
                    setChecked={(checked) => setValue({ ...value, pin: checked })}
                    disabled={disabled || !value.enabled}
                />
                <SwitchItem
                    primary={translations.logging_message_unpin}
                    checked={value.unpin}
                    setChecked={(checked) => setValue({ ...value, unpin: checked })}
                    disabled={disabled || !value.enabled}
                />
            </ItemContent>
        </ItemContainer>
    );
};
