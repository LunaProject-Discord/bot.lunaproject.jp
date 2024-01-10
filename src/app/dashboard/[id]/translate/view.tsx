'use client';

import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '@components/dialog';
import { ActionItem, SwitchItem } from '@components/items';
import { PageHeader } from '@components/layout_v2';
import { SaveConfirmV2 } from '@components/save_confirm_v2';
import { GuildConfigurationTranslate } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { GuildConfigurationTranslateSchema } from '@schemas/bot';
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
            <PageHeader primary={translations.translate} secondary={translations.translate_description} />
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
                source={translateConfiguration}
                target={toObject()}
                schema={GuildConfigurationTranslateSchema}
                disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
