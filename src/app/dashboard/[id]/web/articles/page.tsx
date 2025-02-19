import { NotFoundView } from '@/app/dashboard/[id]/view';
import { getUser } from '@/app/utils';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildWebPagesByGuildId, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: GenericPageParamsProps, parent: ResolvingMetadata) => {
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

const Page = async (props: GenericPageParamsProps) => {
    const { id } = await props.params;

    const localization = await getLocalization();

    const guildData = getGuildById(id);
    const pagesData = getGuildWebPagesByGuildId(id);

    const [guild, pages] = await Promise.all([guildData, pagesData]);

    if (!guild)
        return (<NotFoundView />);

    return (<View guild={guild} pages={pages} localization={localization} />);
};

export default Page;
