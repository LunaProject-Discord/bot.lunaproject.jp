import { NotFoundView } from '@/app/dashboard/[id]/view';
import { getUser } from '@/app/utils';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildWebTagsByGuildId, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: GenericPageParamsProps, parent: ResolvingMetadata) => {
    const { id } = await props.params;

    const { translations } = await getLocalization();
    const title = translations.tags;

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
    const guildWebTagsData = getGuildWebTagsByGuildId(id);

    const [guild, guildWebTags] = await Promise.all([guildData, guildWebTagsData]);

    if (!guild)
        return (<NotFoundView />);

    return (<View guild={guild} tags={guildWebTags} localization={localization} />);
};

export default Page;
