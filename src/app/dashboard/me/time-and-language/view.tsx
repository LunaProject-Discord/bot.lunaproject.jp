'use client';

import { SelectItem } from '@components/items';
import { PageContent, PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { UserConfigurationLanguage } from '@interfaces/bot';
import { UserConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { ScheduleOutlined, TranslateOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { TimeZone, TimeZones } from '@utils/timezone';
import React, { ReactNode } from 'react';
import spacetime from 'spacetime';
import { saveUserConfiguration } from '../utils';

export const View = ({ user, configuration, localization: { translations } }: UserConfigurationViewProps) => {
    const [timezone, setTimezone, resetTimezone] = useResettableState(configuration.timezone);
    const [language, setLanguage, resetLanguage] = useResettableState(configuration.language);

    const handleSaveAction = () => saveUserConfiguration({ timezone, language });

    const handleCancelAction = () => {
        resetTimezone();
        resetLanguage();
    };

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.time_and_language}</Typography>
                    <Typography>{translations.user_time_and_language_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionTitle>{translations.date_and_time}</SectionTitle>
                <SectionContent>
                    <SelectItem<TimeZone>
                        icon={<ScheduleOutlined />}
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
                    <SelectItem<UserConfigurationLanguage>
                        icon={<TranslateOutlined />}
                        primary={translations.language}
                        secondary={translations.user_language_description}
                        value={language}
                        setValue={setLanguage}
                        choices={[
                            { value: 'ja-JP', children: translations.japanese },
                            { value: 'en-US', children: translations.english }
                        ]}
                    />
                </SectionContent>
            </Section>

            <SaveConfirm
                open={timezone !== configuration.timezone || language !== configuration.language}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />
        </PageContent>
    );
};
