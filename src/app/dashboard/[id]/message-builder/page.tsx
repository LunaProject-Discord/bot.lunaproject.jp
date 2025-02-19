import { NotFoundView } from '@/app/dashboard/[id]/view';
import { getUser } from '@/app/utils';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getGuildConfiguration, hasDashboardAccess } from '@/libs/bot';
import { getGuildById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: GenericPageParamsProps, parent: ResolvingMetadata) => {
    const { id } = await props.params;

    const { translations } = await getLocalization();
    const title = translations.vote;

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

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildConfiguration] = await Promise.all([userData, guildData, guildConfigurationData]);

    if (!user || !guild || !guildConfiguration)
        return (<NotFoundView />);

    return (<View user={user} guild={guild} configuration={guildConfiguration} localization={localization} />);
};

export default Page;
