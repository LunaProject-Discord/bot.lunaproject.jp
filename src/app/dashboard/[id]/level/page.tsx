import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { WithIdParamProps } from '../../../../interfaces/page';
import { getGuildSettings } from '../../../../libs/bot';
import { getGuildById, getMemberById } from '../../../../libs/redis';
import { getLocalization } from '../../../../localizations/server';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckMemberPermissions } from '../../../../utils/discord';
import { getUser } from '../../../utils';
import { NotFoundView } from '../view';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.level;

    const user = await getUser();
    const guild = await getGuildById(id);
    if (!user || !guild)
        return parent;

    const member = await getMemberById(user.id, guild.id);
    if (!member || !someCheckMemberPermissions(guild, member, ...ADMINISTRATOR_OR_MANAGE_GUILD))
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
    const guildSettingsData = getGuildSettings(id);

    const [guild, guildSettings] = await Promise.all([guildData, guildSettingsData]);

    if (!guild || !guildSettings)
        return (<NotFoundView />);

    return (<View guild={guild} settings={guildSettings} localization={localization} />);
};

export default Page;
