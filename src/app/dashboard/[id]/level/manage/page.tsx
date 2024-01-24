import { getUser } from '@app/utils';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration, getGuildLevels, hasDashboardAccess } from '@libs/bot';
import { getGuildById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { NotFoundView } from '../../view';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.level_manage;

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

const Page = async ({ params: { id } }: WithIdParamProps) => {
    const localization = getLocalization();

    const guildData = getGuildById(id);
    const guildLevelsData = getGuildLevels(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [guild, guildLevels, guildConfiguration] = await Promise.all([
        guildData,
        guildLevelsData,
        guildConfigurationData
    ]);

    if (!guild || !guildLevels || !guildConfiguration)
        return (<NotFoundView />);

    return (
        <View
            guild={guild}
            levels={guildLevels}
            configuration={guildConfiguration}
            localization={localization}
        />
    );
};

export default Page;
