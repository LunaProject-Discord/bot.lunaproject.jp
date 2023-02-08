'use client';

import { useResettableState } from '@lunaproject-discord/web-core';
import { ScheduleOutlined, TranslateOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import spacetime from 'spacetime';
import { SelectItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { Section, SectionContent, SectionParagraph, SectionTitle } from '../../../../components/section';
import { GuildSettingsLanguage } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { TimeZone, TimeZones } from '../../../../utils/timezone';
import { StyledToolbar } from '../navigation';
import { saveGuildSettings } from '../utils';

export const View = ({ guild, settings, translations }: GuildSettingsViewProps) => {
    const [timezone, setTimezone, resetTimezone] = useResettableState(settings.timezone);
    const [language, setLanguage, resetLanguage] = useResettableState(settings.language);

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            timezone,
            language
        }
    );

    const handleActionCancel = () => {
        resetTimezone();
        resetLanguage();
    };

    return (
        <PageContent position="relative">
            <StyledToolbar />
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.time_and_language}</Typography>
                    <Typography variant="body1">{translations.time_and_language_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionTitle>{translations.date_and_time}</SectionTitle>
                <SectionParagraph>{translations.timezone_description}</SectionParagraph>
                <SectionContent>
                    <SelectItem<TimeZone>
                        icon={<ScheduleOutlined />}
                        primary={translations.timezone}
                        value={timezone}
                        setValue={setTimezone}
                        choices={Object.entries(TimeZones).map(([id, label]): { value: TimeZone; children?: ReactNode; offset: number; } => {
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
                <SectionParagraph>{translations.language_description}</SectionParagraph>
                <SectionContent>
                    <SelectItem<GuildSettingsLanguage>
                        icon={<TranslateOutlined />}
                        primary={translations.language}
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
                open={timezone !== settings.timezone || language !== settings.language}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
