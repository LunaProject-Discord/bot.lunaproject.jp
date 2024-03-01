'use client';

import { ChannelItem, MessageItem, SwitchItem } from '@/components/items';
import { PageHeader } from '@/components/layout_v2';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { CodeStyleContainer } from '@/components/text';
import { GuildConfigurationGoodbye } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationGoodbyeSchema } from '@/schemas/bot';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { ChannelType } from 'discord-api-types/v10';
import React, { Fragment, useState } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [openMessageBuilder, setOpenMessageBuilder] = useState(false);

    const goodbyeConfiguration = configuration.goodbye;
    const [enabled, setEnabled, resetEnabled] = useResettableState(goodbyeConfiguration.enabled);
    const [channelId, setChannelId, resetChannelId] = useResettableState(goodbyeConfiguration.channel_id);
    const [message, setMessage, resetMessage] = useResettableState(goodbyeConfiguration.message);

    const toObject = (): GuildConfigurationGoodbye => ({ enabled, channel_id: channelId, message });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { goodbye: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetChannelId();
        resetMessage();
    };

    return (
        <Fragment>
            <PageHeader primary={translations.goodbye_message} secondary={translations.goodbye_message_description} />
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.goodbye_message_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <ChannelItem
                        primary={translations.send_message_channel}
                        value={channelId}
                        setValue={setChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled}
                        localization={localization}
                    />
                    <MessageItem
                        primary={translations.customize_message}
                        secondary={translations.goodbye_message_edit_description}
                        value={message}
                        setValue={setMessage}
                        disabled={!enabled}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                        localization={localization}
                    >
                        <CodeStyleContainer>{translations.goodbye_message_edit_hint}</CodeStyleContainer>
                    </MessageItem>
                </SectionContent>
            </Section>

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={goodbyeConfiguration}
                target={toObject()}
                schema={GuildConfigurationGoodbyeSchema}
                disableKeyboardShortcuts={openMessageBuilder}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
