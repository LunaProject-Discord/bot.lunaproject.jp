'use client';

import { BadgeIcon, TagIcon } from '@components/icons';
import { TextFieldItem } from '@components/items';
import { PageHeader } from '@components/layout_v2';
import { SaveConfirmV2 } from '@components/save_confirm_v2';
import { CodeStyleContainer } from '@components/text';
import { GuildConfigurationPrefixAndNickname } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { GuildConfigurationPrefixAndNicknameSchema } from '@schemas/bot';
import React, { Fragment } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const prefixAndNicknameConfiguration: GuildConfigurationPrefixAndNickname = {
        prefix: configuration.prefix,
        nickname: configuration.nickname
    };
    const [prefix, setPrefix, resetPrefix] = useResettableState(prefixAndNicknameConfiguration.prefix);
    const [nickname, setNickname, resetNickname] = useResettableState(prefixAndNicknameConfiguration.nickname);

    const toObject = (): GuildConfigurationPrefixAndNickname => ({ prefix, nickname });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, toObject());

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

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={prefixAndNicknameConfiguration}
                target={toObject()}
                schema={GuildConfigurationPrefixAndNicknameSchema}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
