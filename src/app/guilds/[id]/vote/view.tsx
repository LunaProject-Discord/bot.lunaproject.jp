'use client';

import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { APIGuildChannel } from '@lunaproject-discord/web-discord';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { APIRole } from 'discord-api-types/v10';
import React from 'react';
import { SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { Section, SectionContent } from '../../../../components/section';
import { GuildSettingsComponent } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { StyledToolbar } from '../navigation';
import { saveGuildSettings } from '../utils';

interface Props extends GuildSettingsViewProps {
    channels: APIGuildChannel[];
    roles: APIRole[];
}

export const View = ({ guild, channels, roles, settings, translations }: Props) => {
    const vote = settings.vote;
    const [enabled, setEnabled, resetEnabled] = useResettableState(vote.enabled);

    const toObject = (): GuildSettingsComponent => ({
        enabled
    });

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            vote: toObject()
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
                    <Typography variant="h4">{translations.vote}</Typography>
                    <Typography variant="body1">{translations.vote_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.vote_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                </SectionContent>
            </Section>
            <SaveConfirm
                open={!deepEqual(vote, toObject(), { strict: true })}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
