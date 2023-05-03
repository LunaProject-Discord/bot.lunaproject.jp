'use client';

import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { BadgeOutlined, TagOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import React from 'react';
import { TextFieldItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { CodeStyleContainer } from '../../../../components/text';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';

export const View = ({ guild, settings, translations }: GuildSettingsViewProps) => {
    const [prefix, setPrefix, resetPrefix] = useResettableState(settings.prefix);
    const [nickname, setNickname, resetNickname] = useResettableState(settings.nickname);

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            prefix,
            nickname
        }
    );

    const handleActionCancel = () => {
        resetPrefix();
        resetNickname();
    };

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.prefix_and_nickname}</Typography>
                    <Typography variant="body1">{translations.prefix_and_nickname_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <TextFieldItem
                        icon={<TagOutlined />}
                        primary={translations.prefix}
                        value={prefix}
                        setValue={setPrefix}
                    />
                    <TextFieldItem
                        icon={<BadgeOutlined />}
                        primary={translations.nickname}
                        value={nickname}
                        setValue={setNickname}
                    />
                    <Alert severity="info">
                        <AlertTitle>{translations.about_this_settings}</AlertTitle>
                        <CodeStyleContainer>{translations.nickname_hint}</CodeStyleContainer>
                    </Alert>
                </SectionContent>
            </Section>
            <SaveConfirm
                open={prefix !== settings.prefix || nickname !== settings.nickname}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
