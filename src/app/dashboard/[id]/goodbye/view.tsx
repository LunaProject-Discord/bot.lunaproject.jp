'use client';

import { saveGuildConfiguration } from '@/app/dashboard/[id]/utils';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { SectionChannelSelectCard, SectionMessageCard } from '@/components/section_card';
import { CodeStyleContainer } from '@/components/text';
import { GuildConfigurationGoodbye } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationGoodbyeSchema } from '@/schemas/bot';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionSwitchCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { ChannelType } from 'discord-api-types/v10';
import React, { Fragment, useState } from 'react';

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
                    <SectionSwitchCard
                        primary={translations.goodbye_message_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SectionChannelSelectCard
                        primary={translations.send_message_channel}
                        value={channelId}
                        setValue={setChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled}
                        localization={localization}
                    />
                    <SectionMessageCard
                        primary={translations.customize_message}
                        secondary={translations.goodbye_message_edit_description}
                        value={message}
                        setValue={setMessage}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                        disabled={!enabled}
                        localization={localization}
                    >
                        <CodeStyleContainer>
                            {translations.goodbye_message_edit_hint}
                        </CodeStyleContainer>
                    </SectionMessageCard>
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
