import { NotFoundView as OriginalNotFoundView } from '@/app/dashboard/[id]/view';
import { getUser } from '@/app/utils';
import { ArticlePageParamsProps } from '@/interfaces/page';
import {
    getGuildWebCategoriesByGuildId,
    getGuildWebPage,
    getGuildWebTagsByGuildId,
    hasDashboardAccess
} from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { NotFoundView, View } from './view';

export const generateMetadata = async (props: ArticlePageParamsProps, parent: ResolvingMetadata) => {
    const { id } = await props.params;

    const { translations } = await getLocalization();
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

const Page = async (props: ArticlePageParamsProps) => {
    const { id, slug } = await props.params;

    const localization = await getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildWebPageData = getGuildWebPage(slug);
    const guildWebCategoriesData = getGuildWebCategoriesByGuildId(id);
    const guildWebTagsData = getGuildWebTagsByGuildId(id);

    const [user, guild, guildWebPage, guildWebCategories, guildWebTags] = await Promise.all([userData, guildData, guildWebPageData, guildWebCategoriesData, guildWebTagsData]);

    if (!user || !guild)
        return (<OriginalNotFoundView />);

    if (!guildWebPage)
        return (<NotFoundView id={id} localization={localization} />);

    return (
        <View
            user={user}
            guild={guild}
            page={guildWebPage}
            categories={guildWebCategories}
            tags={guildWebTags}
            localization={localization}
        />
    );
};

export default Page;
