'use client';

import { ActionItem, SwitchItem } from '@/components/items';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { GuildConfigurationActivity } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationActivitySchema } from '@/schemas/bot';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import React, { Fragment, useState } from 'react';
import { saveGuildConfiguration } from '../utils';
import { ManageRolesDialog } from './dialog';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [openRolesDialog, setOpenRolesDialog] = useState(false);

    const activityConfiguration = configuration.activity;
    const [enabled, setEnabled, resetEnabled] = useResettableState(activityConfiguration.enabled);
    const [roles, setRoles, resetRoles] = useResettableState(activityConfiguration.roles);

    const toObject = (): GuildConfigurationActivity => ({ enabled, roles });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { activity: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetRoles();
    };

    return (
        <Fragment>
            <PageHeader primary={translations.activity} secondary={translations.activity_description} />
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.activity_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <ActionItem
                        primary={translations.activity_manage_roles}
                        onAction={() => setOpenRolesDialog(true)}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>

            <ManageRolesDialog
                open={openRolesDialog}
                setOpen={setOpenRolesDialog}
                value={roles}
                setValue={setRoles}
                guild={guild}
                localization={localization}
            />

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={activityConfiguration}
                target={toObject()}
                schema={GuildConfigurationActivitySchema}
                disableKeyboardShortcuts={openRolesDialog}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
