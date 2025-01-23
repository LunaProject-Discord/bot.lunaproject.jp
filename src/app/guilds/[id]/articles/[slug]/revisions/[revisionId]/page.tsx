import { NotFoundView } from '@/app/guilds/[id]/view';
import { getUser } from '@/app/utils';
import { ForbiddenView } from '@/app/view';
import { ArticleRevisionPageParamsProps } from '@/interfaces/page';
import { getGuildWebPage, getGuildWebPageContent, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (
    {
        params: {
            id,
            slug,
            revisionId
        }
    }: ArticleRevisionPageParamsProps,
    parent: ResolvingMetadata
) => {
    const userData = getUser();
    const guildData = getGuildById(id);
    const guildWebPageData = getGuildWebPage(slug);

    const [user, guild, guildWebPage] = await Promise.all([userData, guildData, guildWebPageData]);

    if (!guild || !guildWebPage || guildWebPage.guildId !== id)
        return parent;

    const hasPermission = await hasDashboardAccess(guild, user);

    const guildWebPageContent = await getGuildWebPageContent(revisionId);
    if (!guildWebPageContent || guildWebPageContent.pageId !== guildWebPage.id || (!guildWebPageContent.published && !hasPermission))
        return parent;

    const title = guildWebPageContent.title;
    const metadata = await parent;
    return {
        ...metadata,
        title,
        openGraph: {
            ...metadata.openGraph,
            title
        },
        twitter: {
            ...metadata.twitter,
            title
        }
    };
};

const Page = async ({ params: { id, slug, revisionId } }: ArticleRevisionPageParamsProps) => {
    if (!/^\d+$/.test(id))
        return notFound();

    const localization = getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildWebPageData = getGuildWebPage(slug);

    const [user, guild, guildWebPage] = await Promise.all([userData, guildData, guildWebPageData]);

    if (!guild || !guildWebPage || guildWebPage.guildId !== id)
        return (<NotFoundView localization={localization} />);

    const guildWebPageContent = await getGuildWebPageContent(revisionId);
    if (!guildWebPageContent || guildWebPageContent.pageId !== guildWebPage.id)
        return (<NotFoundView localization={localization} />);

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!guildWebPageContent.published && !hasPermission)
        return (<ForbiddenView localization={localization} />);

    return (<View guild={guild} page={guildWebPage} pageContent={guildWebPageContent} localization={localization} />);
};

export default Page;
