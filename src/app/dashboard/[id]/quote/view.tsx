'use client';

import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '@/components/dialog';
import { ActionItem, SwitchItem } from '@/components/items';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { GuildConfigurationQuote } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationQuoteSchema } from '@/schemas/bot';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import React, { Fragment, useState } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [openDisabledChannelsDialog, setOpenDisabledChannelsDialog] = useState(false);
    const [openDisabledRolesDialog, setOpenDisabledRolesDialog] = useState(false);

    const quoteConfiguration = configuration.quote;
    const [enabled, setEnabled, resetEnabled] = useResettableState(quoteConfiguration.enabled);
    const [reaction, setReaction, resetReaction] = useResettableState(quoteConfiguration.reaction);
    const [message, setMessage, resetMessage] = useResettableState(quoteConfiguration.message);
    const [otherGuildToThisGuild, setOtherGuildToThisGuild, resetOtherGuildToThisGuild] = useResettableState(quoteConfiguration.other_guild_to_this_guild);
    const [thisGuildToOtherGuild, setThisGuildToOtherGuild, resetThisGuildToOtherGuild] = useResettableState(quoteConfiguration.this_guild_to_other_guild);
    const [disabledChannels, setDisabledChannels, resetDisabledChannels] = useResettableState(quoteConfiguration.disabled.channels);
    const [disabledRoles, setDisabledRoles, resetDisabledRoles] = useResettableState(quoteConfiguration.disabled.roles);

    const toObject = (): GuildConfigurationQuote => ({
        enabled,
        reaction,
        message,
        other_guild_to_this_guild: otherGuildToThisGuild,
        this_guild_to_other_guild: thisGuildToOtherGuild,
        disabled: {
            channels: disabledChannels,
            roles: disabledRoles
        }
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { quote: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetReaction();
        resetMessage();
        resetOtherGuildToThisGuild();
        resetThisGuildToOtherGuild();
        resetDisabledChannels();
        resetDisabledRoles();
    };

    return (
        <Fragment>
            <PageHeader primary={translations.quote} secondary={translations.quote_description} />
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.quote_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SwitchItem
                        primary={translations.quote_reaction}
                        checked={reaction}
                        setChecked={setReaction}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.quote_message}
                        checked={message}
                        setChecked={setMessage}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.quote_other_guild_to_this_guild}
                        checked={otherGuildToThisGuild}
                        setChecked={setOtherGuildToThisGuild}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.quote_this_guild_to_other_guild}
                        checked={thisGuildToOtherGuild}
                        setChecked={setThisGuildToOtherGuild}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_channels}
                        secondary={translations.quote_manage_disabled_channels_description}
                        onAction={() => setOpenDisabledChannelsDialog(true)}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_roles}
                        secondary={translations.quote_manage_disabled_roles_description}
                        onAction={() => setOpenDisabledRolesDialog(true)}
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

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={quoteConfiguration}
                target={toObject()}
                schema={GuildConfigurationQuoteSchema}
                disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
