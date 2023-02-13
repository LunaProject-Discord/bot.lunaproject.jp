import { getGuildMembersById, GuildMember } from '@lunaproject-discord/web-discord';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { WithIdParamProps } from '../../../../../interfaces/page';
import { getTranslation } from '../../../../../languages/server';
import { getGuildLevels, getGuildSettings } from '../../../../../libs/bot';
import { hasPermission } from '../../../../../utils/discord';
import { getGuildById } from '../../../../utils';
import { NotFoundView } from '../../view';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const translations = getTranslation();
    const title = translations.level_manage;

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

interface Props extends WithIdParamProps {
    searchParams?: {
        after?: number;
        limit?: number;
    };
}

const Page = async ({ params: { id }, searchParams }: Props) => {
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildMembersData = getGuildMembersById(id);

    const guildLevelsData = getGuildLevels(id, false);
    const guildSettingsData = getGuildSettings(id);

    const [guild, guildMembers, guildLevels, guildSettings] = await Promise.all([
        guildData,
        guildMembersData,
        guildLevelsData,
        guildSettingsData
    ]);

    if (!guild || !guildMembers || !guildLevels || !guildSettings)
        return (<NotFoundView />);

    const filteredMembers = guildMembers.filter((member): member is GuildMember => member.user !== undefined);
    const memberIds = filteredMembers.map(({ user }) => user.id);

    return (
        <View
            guild={guild}
            members={filteredMembers}
            levels={guildLevels.filter(({ user }) => memberIds.includes(user.id))}
            settings={guildSettings}
            translations={translations}
        />
    );
};

export default Page;
