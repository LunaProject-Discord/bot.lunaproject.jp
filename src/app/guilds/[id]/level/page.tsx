import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { WithIdParamProps } from '../../../../interfaces/page';
import { getTranslation } from '../../../../languages/server';
import { getGuildSettings } from '../../../../libs/bot';
import { getGuildChannelsById, getGuildRolesById } from '../../../../libs/discord';
import { hasPermission } from '../../../../utils/discord';
import { getGuildById } from '../../../utils';
import { NotFoundView } from '../view';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const translations = getTranslation();
    const title = translations.level;

    const guild = await getGuildById(id);
    if (!guild || !hasPermission(guild))
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
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildChannelsData = getGuildChannelsById(id);
    const guildRolesData = getGuildRolesById(id);

    const guildSettingsData = getGuildSettings(id);

    const [guild, guildChannels, guildRoles, guildSettings] = await Promise.all([
        guildData,
        guildChannelsData,
        guildRolesData,
        guildSettingsData
    ]);

    if (!guild || !guildChannels || !guildRoles || !guildSettings)
        return (<NotFoundView />);

    return (
        <View
            guild={guild}
            channels={guildChannels}
            roles={guildRoles}
            settings={guildSettings}
            translations={translations}
        />
    );
};

export default Page;
