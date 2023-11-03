'use client';

import { SwitchItem } from '@components/items';
import { PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { GuildConfigurationComponent } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import React, { Fragment } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization: { translations } }: GuildConfigurationViewProps) => {
    const voteConfiguration = configuration.vote;
    const [enabled, setEnabled, resetEnabled] = useResettableState(voteConfiguration.enabled);

    const toObject = (): GuildConfigurationComponent => ({
        enabled
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { vote: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
    };

    return (
        <Fragment>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.vote}</Typography>
                    <Typography>{translations.vote_description}</Typography>
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
                open={!deepEqual(voteConfiguration, toObject(), { strict: true })}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />
        </Fragment>
    );
};
