'use client';

import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '@components/dialog';
import { ActionItem, SwitchItem } from '@components/items';
import { PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { GuildConfigurationTranslate } from '@interfaces/bot';
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

    const translateConfiguration = configuration.translate;
    const [enabled, setEnabled, resetEnabled] = useResettableState(translateConfiguration.enabled);
    const [reaction, setReaction, resetReaction] = useResettableState(translateConfiguration.reaction);
    const [disabledChannels, setDisabledChannels, resetDisabledChannels] = useResettableState(translateConfiguration.disabled.channels);
    const [disabledRoles, setDisabledRoles, resetDisabledRoles] = useResettableState(translateConfiguration.disabled.roles);

    const toObject = (): GuildConfigurationTranslate => ({
        enabled,
        reaction,
        disabled: {
            channels: disabledChannels,
            roles: disabledRoles
        }
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { translate: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetReaction();
        resetDisabledChannels();
        resetDisabledRoles();
    };

    return (
        <Fragment>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.translate}</Typography>
                    <Typography>{translations.translate_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.translate_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SwitchItem
                        primary={translations.translate_reaction}
                        checked={reaction}
                        setChecked={setReaction}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_channels}
                        secondary={translations.translate_manage_disabled_channels_description}
                        onAction={() => setOpenDisabledChannelsDialog(true)}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_roles}
                        secondary={translations.translate_manage_disabled_roles_description}
                        onAction={() => setOpenDisabledRolesDialog(true)}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>

            <SaveConfirm
                open={!deepEqual(translateConfiguration, toObject(), { strict: true })}
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
