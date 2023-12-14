'use client';

import { SwitchItem } from '@components/items';
import { PageHeader } from '@components/layout_v2';
import { SaveConfirm } from '@components/save_confirm';
import { GuildConfigurationRoot } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import deepEqual from 'deep-equal';
import React, { Fragment } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization: { translations } }: GuildConfigurationViewProps) => {
    const voteConfiguration = configuration.vote;
    const [enabled, setEnabled, resetEnabled] = useResettableState(voteConfiguration.enabled);

    const toObject = (): GuildConfigurationRoot => ({
        enabled
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { vote: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
    };

    return (
        <Fragment>
            <PageHeader primary={translations.vote} secondary={translations.vote_description} />
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
