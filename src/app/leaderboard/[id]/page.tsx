import { getUser } from '@app/utils';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration, getGuildLevels } from '@libs/bot';
import { getGuildById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { NotFoundView, View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();

    const userData = getUser();
    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildConfiguration] = await Promise.all([userData, guildData, guildConfigurationData]);
    if (!user || !guild || !guildConfiguration || !guildConfiguration.level.enabled)
        return parent;

    const title = `${translations.leaderboard} [${guild.name}]`;
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
    const guildLevelsData = getGuildLevels(id, false);
    const guildConfigurationData = getGuildConfiguration(id);

    const [guild, guildLevels, guildConfiguration] = await Promise.all([
        guildData,
        guildLevelsData,
        guildConfigurationData
    ]);

    if (!guild || !guildConfiguration || !guildConfiguration.level.enabled)
        return (<NotFoundView localization={localization} />);

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
