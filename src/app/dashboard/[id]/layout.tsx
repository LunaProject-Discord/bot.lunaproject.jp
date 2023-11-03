import { getGuilds, getUser } from '@app/utils';
import { UnauthorizedView } from '@app/view';
import { PageWithSidebarLayout } from '@components/layout_v2';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration, getGuildFlags, getUserFlags } from '@libs/bot';
import { getAndRequestUserGuildsById, getGuildById, getMemberById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { OAuthGuild } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { Box } from '@mui/material';
import {
    ADMINISTRATOR_OR_MANAGE_GUILD,
    someCheckMemberPermissions,
    someCheckPermissions,
    sortGuilds
} from '@utils/discord';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { ReactNode } from 'react';
import { Navigation } from './navigation';
import { ForbiddenView, NotFoundView } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();

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
        title: {
            default: `${translations.guild_settings} » ${guild.name}`,
            template: `%s [${guild.name}] | 結月 -ゆづき-`
        },
        openGraph: {
            ...metadata.openGraph,
            title: {
                default: `${translations.guild_settings} » ${guild.name}`,
                template: `%s [${guild.name}]`
            }
        },
        twitter: {
            ...metadata.twitter,
            title: {
                default: `${translations.guild_settings} » ${guild.name}`,
                template: `%s [${guild.name}]`
            }
        },
        robots: {
            ...metadata.robots,
            index: false
        }
    };
};

const Layout = async ({ children, params: { id } }: WithIdParamProps & { children: ReactNode }) => {
    const localization = getLocalization();

    const userData = getUser();
    const guildsData = getGuilds();

    const guildData = getGuildById(id);
    const guildFlagsData = getGuildFlags(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guilds, guild, guildFlags, guildConfiguration] = await Promise.all([
        userData,
        guildsData,
        guildData,
        guildFlagsData,
        guildConfigurationData
    ]);
    const userFlags = user ? await getUserFlags(user.id) : undefined;

    if (!user)
        return (<UnauthorizedView localization={localization} />);

    if (!guild || !guildFlags || !guildConfiguration)
        return (<NotFoundView />);

    const member = await getMemberById(user.id, guild.id);
    if (!member || !someCheckMemberPermissions(guild, member, ...ADMINISTRATOR_OR_MANAGE_GUILD))
        return (<ForbiddenView />);

    const mutualGuilds = await getAndRequestUserGuildsById(user.id);

    const sortedGuilds = sortGuilds(guilds.filter((guild) => someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))) as OAuthGuild[];

    return (
        <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
            <Navigation
                user={user}
                userFlags={userFlags}
                guild={guild}
                guildFlags={guildFlags}
                guilds={sortedGuilds}
                mutualGuilds={mutualGuilds.map((mutualGuild) => mutualGuild.id)}
                localization={localization}
            />
            <PageWithSidebarLayout>{children}</PageWithSidebarLayout>
        </Box>
    );
};

export default Layout;
