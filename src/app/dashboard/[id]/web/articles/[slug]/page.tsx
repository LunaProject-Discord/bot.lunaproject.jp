import { NotFoundView } from '@/app/dashboard/[id]/view';
import { getUser } from '@/app/utils';
import { ArticlePageParamsProps } from '@/interfaces/page';
import { getGuildWebPage, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { View } from './view';

export const generateMetadata = async ({ params: { id, slug } }: ArticlePageParamsProps, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.web_pages;

    const user = await getUser();
    const guild = await getGuildById(id);
    if (!user || !guild)
        return parent;

    const hasPermission = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return parent;

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

const Page = async ({ params: { id, slug } }: ArticlePageParamsProps) => {
    const localization = getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildWebPageData = getGuildWebPage(slug);

    const [user, guild, guildWebPage] = await Promise.all([userData, guildData, guildWebPageData]);

    if (!user || !guild || !guildWebPage)
        return (<NotFoundView />);

    return (<View user={user} guild={guild} page={guildWebPage} localization={localization} />);
};

export default Page;
