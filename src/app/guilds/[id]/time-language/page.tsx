import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { WithIdParamProps } from '../../../../interfaces/page';
import { getTranslation } from '../../../../languages/server';
import { getGuildSettings } from '../../../../libs/bot';
import { hasPermission } from '../../../../utils/discord';
import { getGuildById } from '../../../utils';
import { NotFoundView } from '../view';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const translations = getTranslation();
    const title = translations.time_and_language;

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
    const guildSettingsData = getGuildSettings(id);

    const [guild, guildSettings] = await Promise.all([guildData, guildSettingsData]);

    if (!guild || !guildSettings)
        return (<NotFoundView />);

    return (<View guild={guild} settings={guildSettings} translations={translations} />);
};

export default Page;
