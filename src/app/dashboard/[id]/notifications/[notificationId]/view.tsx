'use client';

import { GuildNotification } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { useLocale } from '@/localizations/client';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionParagraph, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import React, { Fragment } from 'react';

interface Props extends GuildViewProps {
    notification: GuildNotification;
}

export const View = ({ guild, notification, localization: { translations } }: Props) => {
    const language = useLocale();

    return (
        <Fragment>
            <PageHeader primary={translations.notifications} />
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
