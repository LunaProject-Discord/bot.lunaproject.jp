'use client';

import { PageHeader } from '@components/layout';
import { UserNotification } from '@interfaces/bot';
import { UserViewProps } from '@interfaces/view';
import { useLocale } from '@localizations/client';
import { Section, SectionParagraph, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { Box, Typography } from '@mui/material';
import React, { Fragment } from 'react';

interface Props extends UserViewProps {
    notification: UserNotification;
}


export const View = ({ user, notification, localization: { translations } }: Props) => {
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
