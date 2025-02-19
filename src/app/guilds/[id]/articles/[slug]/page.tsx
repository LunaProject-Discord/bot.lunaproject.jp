import { NotFoundView } from '@/app/guilds/[id]/view';
import { ArticlePageParamsProps } from '@/interfaces/page';
import { getGuildWebPage } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: ArticlePageParamsProps, parent: ResolvingMetadata) => {
    const { id, slug } = await props.params;

    const guildData = getGuildById(id);
    const guildWebPageData = getGuildWebPage(slug);

    const [guild, guildWebPage] = await Promise.all([guildData, guildWebPageData]);

    if (!guild || !guildWebPage || guildWebPage.guildId !== id || !guildWebPage.content)
        return parent;

    const title = guildWebPage.content.title;
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

    const guildData = getGuildById(id);
    const guildWebPageData = getGuildWebPage(slug);

    const [guild, guildWebPage] = await Promise.all([guildData, guildWebPageData]);

    if (!guild || !guildWebPage || guildWebPage.guildId !== id || !guildWebPage.content)
        return (<NotFoundView localization={localization} />);

    return (
        <View
            guild={guild}
            page={guildWebPage as Parameters<typeof View>[0]['page']}
            localization={localization}
        />
    );
};

export default Page;
