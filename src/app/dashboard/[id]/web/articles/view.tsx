'use client';

import { AddIcon } from '@/components/icons';
import { GuildWebPage } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionRouteLinkCard } from '@lunaproject/web-core/dist/components/SectionCard';
import React, { Fragment } from 'react';

interface ViewProps extends GuildViewProps {
    pages: GuildWebPage[];
}

export const View = ({ guild, pages, localization }: ViewProps) => {
    const { translations } = localization;


    return (
        <Fragment>
            <PageHeader primary={translations.web_pages} secondary={translations.web_pages_description}>
                <Button
                    // onClick={handleAddButtonClick}
                    disableElevation
                    variant="contained"
                    corners="extended"
                    size="large"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ ml: { md: 'auto' } }}
                >
                    {translations.add}
                </Button>
            </PageHeader>
            <Section>
                <SectionContent>
                    {pages.map((page) => (
                        <SectionRouteLinkCard
                            key={page.id}
                            primary={page.content?.title}
                            href={`/dashboard/${guild.id}/web/articles/${page.id.toLowerCase()}`}
                        />
                    ))}
                </SectionContent>
            </Section>
        </Fragment>
    );
};
