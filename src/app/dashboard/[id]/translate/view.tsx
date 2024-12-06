'use client';

import { saveGuildConfiguration } from '@/app/dashboard/[id]/utils';
import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '@/components/dialog';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { GuildConfigurationTranslate } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationTranslateSchema } from '@/schemas/bot';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionButtonActionCard, SectionSwitchCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import React, { Fragment, useState } from 'react';

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
                    <SectionSwitchCard
                        primary={translations.translate_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SectionSwitchCard
                        primary={translations.translate_reaction}
                        checked={reaction}
                        setChecked={setReaction}
                        disabled={!enabled}
                    />
                    <SectionButtonActionCard
                        primary={translations.manage_disabled_channels}
                        secondary={translations.translate_manage_disabled_channels_description}
                        onClick={() => setOpenDisabledChannelsDialog(true)}
                        disabled={!enabled}
                    />
                    <SectionButtonActionCard
                        primary={translations.manage_disabled_roles}
                        secondary={translations.translate_manage_disabled_roles_description}
                        onClick={() => setOpenDisabledRolesDialog(true)}
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
