import { buttonBaseClasses, Paper, styled, Switch, switchClasses, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import {
    ChannelItem,
    ItemButtonBase,
    ItemDisabledProps,
    ItemFormContainer,
    ItemRowContainer,
    ItemVariableProps,
    SwitchItem
} from '../../../../components/items';
import { Section, SectionContent } from '../../../../components/section';
import {
    GuildSettingsLoggingChannel,
    GuildSettingsLoggingComponent,
    GuildSettingsLoggingMember,
    GuildSettingsLoggingMessage,
    GuildSettingsLoggingModeration,
    GuildSettingsLoggingObject,
    GuildSettingsLoggingVoice
} from '../../../../interfaces/bot';
import { RedisChannel } from '../../../../interfaces/redis';
import { TranslatableViewProps } from '../../../../interfaces/view';

export const GridContainer = styled(Section)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr'
    }
}));

const ItemContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
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
    <ItemButtonBase
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
    </ItemButtonBase>
);

interface Props<T extends GuildSettingsLoggingComponent> extends ItemDisabledProps, ItemVariableProps<T>, TranslatableViewProps {
    channels: RedisChannel[];
}

export const Moderation = (
    {
        value,
        setValue,
        channels,
        disabled,
        translations
    }: Props<GuildSettingsLoggingModeration>
) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Member = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingMember>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Voice = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingVoice>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Category = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingChannel>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const TextChannel = (
    {
        value,
        setValue,
        channels,
        disabled,
        translations
    }: Props<GuildSettingsLoggingChannel>
) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const VoiceChannel = (
    {
        value,
        setValue,
        channels,
        disabled,
        translations
    }: Props<GuildSettingsLoggingChannel>
) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Role = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingObject>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Emote = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingObject>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Invite = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingObject>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Webhook = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingObject>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Integration = ({
                                value,
                                setValue,
                                channels,
                                disabled,
                                translations
                            }: Props<GuildSettingsLoggingObject>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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

export const Message = ({ value, setValue, channels, disabled, translations }: Props<GuildSettingsLoggingMessage>) => (
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
                setValue={(channelId) => setValue({ ...value, channel_id: channelId })}
                choices={channels}
                disabled={disabled || !value.enabled}
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
