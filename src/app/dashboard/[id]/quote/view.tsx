'use client';

import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { ChannelType } from 'discord-api-types/v10';
import React, { MouseEvent, useState } from 'react';
import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '../../../../components/dialog';
import { ActionItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { GuildSettingsQuote } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';

export const View = ({ guild, settings, translations }: GuildSettingsViewProps) => {
    const [openDisabledChannelsDialog, setOpenDisabledChannelsDialog] = useState(false);
    const [openDisabledRolesDialog, setOpenDisabledRolesDialog] = useState(false);

    const quote = settings.quote;
    const [enabled, setEnabled, resetEnabled] = useResettableState(quote.enabled);
    const [reaction, setReaction, resetReaction] = useResettableState(quote.reaction);
    const [message, setMessage, resetMessage] = useResettableState(quote.message);
    const [otherGuildToThisGuild, setOtherGuildToThisGuild, resetOtherGuildToThisGuild] = useResettableState(quote.other_guild_to_this_guild);
    const [thisGuildToOtherGuild, setThisGuildToOtherGuild, resetThisGuildToOtherGuild] = useResettableState(quote.this_guild_to_other_guild);

    const toObject = (): GuildSettingsQuote => ({
        enabled,
        reaction,
        message,
        other_guild_to_this_guild: otherGuildToThisGuild,
        this_guild_to_other_guild: thisGuildToOtherGuild,
        disabled: quote.disabled
    });

    const handleClickDisabledChannelsDialogSaveButton = (e: MouseEvent<HTMLButtonElement>, channels: string[]) => saveGuildSettings(
        guild.id,
        {
            quote: {
                ...quote,
                disabled: {
                    ...quote.disabled,
                    channels
                }
            }
        }
    );

    const handleClickDisabledRolesDialogSaveButton = (e: MouseEvent<HTMLButtonElement>, roles: string[]) => saveGuildSettings(
        guild.id,
        {
            translate: {
                ...quote,
                disabled: {
                    ...quote.disabled,
                    roles
                }
            }
        }
    );

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            quote: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
        resetReaction();
        resetMessage();
        resetOtherGuildToThisGuild();
        resetThisGuildToOtherGuild();
    };

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.quote}</Typography>
                    <Typography variant="body1">{translations.quote_description}</Typography>
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
            <ManageDisabledChannelsDialog
                open={openDisabledChannelsDialog}
                onClose={() => setOpenDisabledChannelsDialog(false)}
                choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildStageVoice)}
                values={quote.disabled.channels}
                onClickSaveButton={handleClickDisabledChannelsDialogSaveButton}
            />
            <ManageDisabledRolesDialog
                open={openDisabledRolesDialog}
                onClose={() => setOpenDisabledRolesDialog(false)}
                choices={guild.roles}
                values={quote.disabled.roles}
                onClickSaveButton={handleClickDisabledRolesDialogSaveButton}
            />
            <SaveConfirm
                open={!deepEqual(quote, toObject(), { strict: true })}
                disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
