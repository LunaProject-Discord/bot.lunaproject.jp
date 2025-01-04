import { getGuilds, getUser } from '@/app/utils';
import { UnauthorizedView } from '@/app/view';
import { WithIdParamProps } from '@/interfaces/page';
import {
    getGuildConfiguration,
    getGuildFlags,
    getUserFlags,
    hasDashboardAccess,
    hasDashboardAccessMemberPermission,
    hasDashboardAccessUserPermission
} from '@/libs/bot';
import { getAndRequestUserGuildsById, getGuildById, getMemberById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions, sortGuilds } from '@/utils/discord';
import { PageSidebarLayout, RootSidebarLayout } from '@lunaproject/web-core/dist/components/Layout';
import { Alert, AlertTitle } from '@mui/material';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { notFound } from 'next/navigation';
import React, { ReactNode } from 'react';
import { Navigation } from './navigation';
import { ForbiddenView, NotFoundView } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();

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

const Layout = async ({ children, params: { id } }: WithIdParamProps & { children: ReactNode; }) => {
    if (!/^\d+$/.test(id))
        return notFound();

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

    const isManager = await hasDashboardAccessUserPermission(user);
    if (!isManager) {
        const member = await getMemberById(user.id, guild.id);
        if (!member)
            return (<NotFoundView />);

        const hasPermission = hasDashboardAccessMemberPermission(guild, member);
        if (!hasPermission)
            return (<ForbiddenView />);
    }

    const mutualGuilds = await getAndRequestUserGuildsById(user.id);
    const mutualGuildIds = mutualGuilds.map((mutualGuild) => mutualGuild.id);

    const sortedGuilds = sortGuilds(guilds.filter((guild) => someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD)));
    const filteredSortedGuilds = sortedGuilds.filter((sortedGuild) => mutualGuildIds.includes(sortedGuild.id));

    return (
        <RootSidebarLayout>
            <Navigation
                user={user}
                userManager={isManager}
                userFlags={userFlags}
                guild={guild}
                guildFlags={guildFlags}
                guildConfiguration={guildConfiguration}
                guilds={sortedGuilds}
                mutualGuilds={mutualGuildIds}
                localization={localization}
            />
            <PageSidebarLayout sx={{ pb: 9 }}>
                {(isManager && filteredSortedGuilds.every((sortedGuild) => sortedGuild.id !== guild.id)) && <Alert
                    severity="warning"
                    className="mb-6"
                >
                    <AlertTitle>サービスの運営としてアクセスしています！</AlertTitle>
                    現在、あなたはサービスの運営としてこのサーバーのダッシュボードにアクセスしています。<br />
                    このサーバーの管理者よりサポートの要求が行われたなどの理由以外で、本来権限がないサーバーの設定を変更することは禁止されています。
                </Alert>}
                {children}
            </PageSidebarLayout>
        </RootSidebarLayout>
    );
};

export default Layout;
