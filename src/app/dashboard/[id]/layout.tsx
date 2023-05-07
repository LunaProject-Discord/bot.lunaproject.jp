import { hasPermission as hasPermissionForOAuthGuild } from '@lunaproject-discord/web-discord/dist/utils';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { Fragment, ReactNode } from 'react';
import { WithIdParamProps } from '../../../interfaces/page';
import { getGuildSettings } from '../../../libs/bot';
import { getAndRequestUserGuildsById, getGuildById, getMemberById } from '../../../libs/redis';
import { getLocalization } from '../../../localizations/server';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckMemberPermissions, sortOAuthGuilds } from '../../../utils/discord';
import { getGuilds, getUser } from '../../utils';
import { UnauthorizedView } from '../../view';
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
    const guildSettingsData = getGuildSettings(id);

    const [user, guilds, guild, guildSettings] = await Promise.all([userData, guildsData, guildData, guildSettingsData]);

    if (!user)
        return (<UnauthorizedView localization={localization} />);

    if (!guild || !guildSettings)
        return (<NotFoundView />);

    const member = await getMemberById(user.id, guild.id);
    if (!member || !someCheckMemberPermissions(guild, member, ...ADMINISTRATOR_OR_MANAGE_GUILD))
        return (<ForbiddenView />);

    const mutualGuilds = await getAndRequestUserGuildsById(user.id);

    const sortedGuilds = sortOAuthGuilds(guilds.filter((guild) => hasPermissionForOAuthGuild(guild)));

    return (
        <Fragment>
            <Navigation
                guild={guild}
                user={user}
                guilds={sortedGuilds}
                mutualGuilds={mutualGuilds.map((mutualGuild) => mutualGuild.id)}
                localization={localization}
            />
            {children}
        </Fragment>
    );
};

export default Layout;
