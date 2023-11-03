'use client';

import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '@components/dialog';
import { ActionItem, SwitchItem } from '@components/items';
import { PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { GuildConfigurationQuote } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
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
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.quote}</Typography>
                    <Typography>{translations.quote_description}</Typography>
                </Box>
            </PageHeader>
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

            <SaveConfirm
                open={!deepEqual(quoteConfiguration, toObject(), { strict: true })}
                disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />

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
        </Fragment>
    );
};
