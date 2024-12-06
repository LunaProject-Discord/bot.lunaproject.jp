'use client';

import { saveGuildConfiguration } from '@/app/dashboard/[id]/utils';
import { BadgeIcon, TagIcon } from '@/components/icons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { CodeStyleContainer } from '@/components/text';
import { GuildConfigurationPrefixAndNickname } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationPrefixAndNicknameSchema } from '@/schemas/bot';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionTextFieldCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import React, { Fragment } from 'react';

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
                    <SectionTextFieldCard
                        icon={<TagIcon />}
                        primary={translations.prefix}
                        value={prefix}
                        setValue={setPrefix}
                        slotProps={{
                            control: {
                                inputProps: {
                                    maxLength: 32
                                }
                            }
                        }}
                    />
                    <SectionTextFieldCard
                        icon={<BadgeIcon />}
                        primary={translations.nickname}
                        secondary={<CodeStyleContainer>{translations.nickname_description}</CodeStyleContainer>}
                        value={nickname}
                        setValue={setNickname}
                        slotProps={{
                            control: {
                                inputProps: {
                                    maxLength: 32
                                }
                            }
                        }}
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
