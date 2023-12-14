'use client';

import { BadgeIcon, TagIcon } from '@components/icons';
import { TextFieldItem } from '@components/items';
import { PageHeader } from '@components/layout_v2';
import { SaveConfirm } from '@components/save_confirm';
import { CodeStyleContainer } from '@components/text';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import React, { Fragment } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization: { translations } }: GuildConfigurationViewProps) => {
    const [prefix, setPrefix, resetPrefix] = useResettableState(configuration.prefix);
    const [nickname, setNickname, resetNickname] = useResettableState(configuration.nickname);

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { prefix, nickname });

    const handleCancelAction = () => {
        resetPrefix();
        resetNickname();
    };

    return (
        <Fragment>
            <PageHeader
                primary={translations.prefix_and_nickname}
                secondary={translations.prefix_and_nickname_description}
            />
            <Section>
                <SectionContent>
                    <TextFieldItem
                        icon={<TagIcon />}
                        primary={translations.prefix}
                        value={prefix}
                        setValue={setPrefix}
                    />
                    <TextFieldItem
                        icon={<BadgeIcon />}
                        primary={translations.nickname}
                        secondary={<CodeStyleContainer>{translations.nickname_description}</CodeStyleContainer>}
                        value={nickname}
                        setValue={setNickname}
                        maxLength={32}
                    />
                </SectionContent>
            </Section>

            <SaveConfirm
                open={prefix !== configuration.prefix || nickname !== configuration.nickname}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />
        </Fragment>
    );
};
