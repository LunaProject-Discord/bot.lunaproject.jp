'use client';

import { SwitchItem } from '@components/items';
import { PageHeader } from '@components/layout_v2';
import { SaveConfirmV2 } from '@components/save_confirm_v2';
import { ConfigurationRoot } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { ConfigurationRootSchema } from '@schemas/bot';
import React, { Fragment } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const voteConfiguration = configuration.vote;
    const [enabled, setEnabled, resetEnabled] = useResettableState(voteConfiguration.enabled);

    const toObject = (): ConfigurationRoot => ({
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

            <SaveConfirmV2
                source={voteConfiguration}
                target={toObject()}
                schema={ConfigurationRootSchema}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
