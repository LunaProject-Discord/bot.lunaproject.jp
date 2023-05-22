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
import { GuildConfigurationViewProps } from '../../../../interfaces/view';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization: { translations } }: GuildConfigurationViewProps) => {
    const [prefix, setPrefix, resetPrefix] = useResettableState(configuration.prefix);
    const [nickname, setNickname, resetNickname] = useResettableState(configuration.nickname);

    const handleActionSave = () => saveGuildConfiguration(
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
                        maxLength={32}
                    />
                    <Alert severity="info">
                        <AlertTitle>{translations.about_this_settings}</AlertTitle>
                        <CodeStyleContainer>{translations.nickname_hint}</CodeStyleContainer>
                    </Alert>
                </SectionContent>
            </Section>

            <SaveConfirm
                open={prefix !== configuration.prefix || nickname !== configuration.nickname}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
