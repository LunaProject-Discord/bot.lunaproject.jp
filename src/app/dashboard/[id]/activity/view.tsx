'use client';

import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import React from 'react';
import { RouteLinkItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { Section, SectionContent } from '../../../../components/section';
import { GuildSettingsActivity } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { StyledToolbar } from '../navigation';
import { saveGuildSettings } from '../utils';

export const View = ({ guild, settings, translations }: GuildSettingsViewProps) => {
    const activity = settings.activity;
    const [enabled, setEnabled, resetEnabled] = useResettableState(activity.enabled);

    const toObject = (): GuildSettingsActivity => ({
        enabled,
        roles: activity.roles
    });

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            activity: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
    };

    return (
        <PageContent position="relative">
            <StyledToolbar />
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
                    <RouteLinkItem
                        primary={translations.activity_manage_roles}
                        href={`/dashboard/${guild.id}/activity/roles`}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <SaveConfirm
                open={!deepEqual(activity, toObject(), { strict: true })}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
