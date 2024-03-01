'use client';

import { ScheduleIcon, TranslateIcon } from '@/components/icons';
import { SelectItem } from '@/components/items';
import { PageHeader } from '@/components/layout_v2';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { ConfigurationLanguage, ConfigurationTimeAndLanguage } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { ConfigurationTimeAndLanguageSchema } from '@/schemas/bot';
import { TimeZone, TimeZones } from '@/utils/timezone';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import React, { Fragment, ReactNode } from 'react';
import spacetime from 'spacetime';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const timeAndLanguageConfiguration: ConfigurationTimeAndLanguage = {
        timezone: configuration.timezone,
        language: configuration.language
    };
    const [timezone, setTimezone, resetTimezone] = useResettableState(timeAndLanguageConfiguration.timezone);
    const [language, setLanguage, resetLanguage] = useResettableState(timeAndLanguageConfiguration.language);

    const toObject = (): ConfigurationTimeAndLanguage => ({ timezone, language });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, toObject());

    const handleCancelAction = () => {
        resetTimezone();
        resetLanguage();
    };

    return (
        <Fragment>
            <PageHeader
                primary={translations.time_and_language}
                secondary={translations.guild_time_and_language_description}
            />
            <Section>
                <SectionTitle>{translations.date_and_time}</SectionTitle>
                <SectionContent>
                    <SelectItem<TimeZone>
                        icon={<ScheduleIcon />}
                        primary={translations.timezone}
                        secondary={translations.timezone_description}
                        value={timezone}
                        setValue={setTimezone}
                        choices={Object.entries(TimeZones).map(([id, label]): {
                            value: TimeZone;
                            children?: ReactNode;
                            offset: number;
                        } => {
                            const now = spacetime.now(id);
                            const tz = now.timezone();

                            const min = tz.current.offset * 60;
                            const hr = `${(min / 60) ^ 0}:` + (min % 60 === 0 ? '00' : Math.abs(min % 60));

                            return {
                                value: id as TimeZone,
                                children: `(GMT${hr.includes('-') ? hr : `+${hr}`}) ${label}`,
                                offset: tz.current.offset
                            };
                        }).sort((a, b) => a.offset - b.offset)}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.language}</SectionTitle>
                <SectionContent>
                    <SelectItem<ConfigurationLanguage>
                        icon={<TranslateIcon />}
                        primary={translations.language}
                        secondary={translations.guild_language_description}
                        value={language}
                        setValue={setLanguage}
                        choices={[
                            { value: 'ja-JP', children: translations.japanese },
                            { value: 'en-US', children: translations.english }
                        ]}
                    />
                </SectionContent>
            </Section>

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={timeAndLanguageConfiguration}
                target={toObject()}
                schema={ConfigurationTimeAndLanguageSchema}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
