'use client';

import { PageHeader } from '@components/layout';
import { GuildNotification } from '@interfaces/bot';
import { GuildViewProps } from '@interfaces/view';
import { useLocale } from '@localizations/client';
import { Section, SectionParagraph, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { Box, Typography } from '@mui/material';
import React, { Fragment } from 'react';

interface Props extends GuildViewProps {
    notification: GuildNotification;
}


export const View = ({ guild, notification, localization: { translations } }: Props) => {
    const language = useLocale();

    return (
        <Fragment>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.notifications}</Typography>
                    <Typography></Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionTitle>{notification.title}</SectionTitle>
                <SectionParagraph>
                    {notification.description.split('\n').map((line, i) => (
                        <Fragment key={i}>{line}<br /></Fragment>
                    ))}
                </SectionParagraph>
            </Section>
        </Fragment>
    );
};
