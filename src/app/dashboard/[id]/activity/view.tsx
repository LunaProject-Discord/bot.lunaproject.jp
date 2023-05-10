'use client';

import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import React, { Fragment, useState } from 'react';
import { ActionItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { GuildSettingsActivity } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';
import { ManageRolesDialog } from './dialog';

export const View = ({ guild, settings, localization }: GuildSettingsViewProps) => {
    const { translations } = localization;

    const [openRolesDialog, setOpenRolesDialog] = useState(false);

    const activity = settings.activity;
    const [enabled, setEnabled, resetEnabled] = useResettableState(activity.enabled);
    const [roles, setRoles, resetRoles] = useResettableState(activity.roles);

    const toObject = (): GuildSettingsActivity => ({ enabled, roles });

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            activity: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
        resetRoles();
    };

    return (
        <Fragment>
            <PageContent>
                <PageHeader>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                        <Typography variant="h4">{translations.activity}</Typography>
                        <Typography variant="body1">{translations.activity_description}</Typography>
                    </Box>
                </PageHeader>
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

                <SaveConfirm
                    open={!deepEqual(activity, toObject(), { strict: true })}
                    disableKeyboardShortcuts={openRolesDialog}
                    onSave={handleActionSave}
                    onCancel={handleActionCancel}
                />
            </PageContent>

            <ManageRolesDialog
                open={openRolesDialog}
                setOpen={setOpenRolesDialog}
                value={roles}
                setValue={setRoles}
                roles={guild.roles}
                localization={localization}
            />
        </Fragment>
    );
};
