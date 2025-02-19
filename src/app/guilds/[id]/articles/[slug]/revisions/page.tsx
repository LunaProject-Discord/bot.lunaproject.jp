import { NotFoundView } from '@/app/guilds/[id]/view';
import { getUser } from '@/app/utils';
import { ArticlePageParamsProps } from '@/interfaces/page';
import { getGuildWebPage, getGuildWebPageContentsByPageId, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: ArticlePageParamsProps, parent: ResolvingMetadata) => {
    const { id, slug } = await props.params;

    const { translations } = await getLocalization();
    const title = translations.web_pages;

    const guild = await getGuildById(id);
    if (!guild)
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

    const [user, guild, guildWebPage] = await Promise.all([userData, guildData, guildWebPageData]);

    if (!guild || !guildWebPage || guildWebPage.guildId !== id)
        return (<NotFoundView localization={localization} />);

    const guildWebPageContents = await getGuildWebPageContentsByPageId(slug);

    const hasPermission = await hasDashboardAccess(guild, user);

    return (
        <View
            guild={guild}
            page={guildWebPage}
            contents={guildWebPageContents.filter((content) => hasPermission || content.published)}
            localization={localization}
        />
    );
};

export default Page;
