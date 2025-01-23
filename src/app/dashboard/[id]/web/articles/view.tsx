'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { AddIcon, CloudOffIcon } from '@/components/icons';
import { CreateGuildWebPage, GuildWebPage } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { LoadingButton } from '@lunaproject/web-core/dist/components/Button';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionRouteLinkCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';

interface ViewProps extends GuildViewProps {
    pages: GuildWebPage[];
}

export const View = ({ guild, pages, localization }: ViewProps) => {
    const { translations } = localization;

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleAddButtonClick = async () => {
        if (loading)
            return;

        setLoading(true);

        const data: CreateGuildWebPage = {
            slug: null,
            content: null,
            category: null,
            tags: []
        };

        const response = await fetch(
            `/api/guilds/${guild.id}/web/articles`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                credentials: 'include'
            }
        );

        if (!response.ok) {
            setLoading(false);
            return;
        }

        const page: GuildWebPage = await response.json();
        router.push(`/dashboard/${guild.id}/web/articles/${page.id.toLowerCase()}`);
    };

    return (
        <Fragment>
            <PageHeader primary={translations.web_pages} secondary={translations.web_pages_description}>
                <LoadingButton
                    onClick={handleAddButtonClick}
                    loading={loading}
                    disableElevation
                    variant="contained"
                    corners="extended"
                    size="large"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ ml: { md: 'auto' } }}
                >
                    {translations.add}
                </LoadingButton>
            </PageHeader>
            {pages.length > 0 ? <Section>
                <SectionContent>
                    {pages.map((page) => (
                        <SectionRouteLinkCard
                            key={page.id}
                            primary={page.content?.title}
                            href={`/dashboard/${guild.id}/web/articles/${page.id.toLowerCase()}`}
                        />
                    ))}
                </SectionContent>
            </Section> : <ErrorRoot>
                <CloudOffIcon sx={{ fontSize: '10rem' }} />
                <ErrorTitle>{translations.error_data_not_found_title}</ErrorTitle>
                <ErrorDescription>{translations.error_data_not_found_description}</ErrorDescription>
            </ErrorRoot>}
        </Fragment>
    );
};
