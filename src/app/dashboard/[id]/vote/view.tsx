'use client';

import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import React from 'react';
import { SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { GuildConfigurationComponent } from '../../../../interfaces/bot';
import { GuildConfigurationViewProps } from '../../../../interfaces/view';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization: { translations } }: GuildConfigurationViewProps) => {
    const vote = configuration.vote;
    const [enabled, setEnabled, resetEnabled] = useResettableState(vote.enabled);

    const toObject = (): GuildConfigurationComponent => ({
        enabled
    });

    const handleActionSave = () => saveGuildConfiguration(
        guild.id,
        {
            vote: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
    };

    return (
        <PageContent>
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
