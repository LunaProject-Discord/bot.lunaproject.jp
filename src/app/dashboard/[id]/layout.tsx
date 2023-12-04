import { getGuilds, getUser } from '@app/utils';
import { UnauthorizedView } from '@app/view';
import { PageWithSidebarLayout } from '@components/layout_v2';
import { WithIdParamProps } from '@interfaces/page';
import { getGuildConfiguration, getGuildFlags, getUserFlags, hasDashboardAccess } from '@libs/bot';
import { getAndRequestUserGuildsById, getGuildById } from '@libs/redis';
import { getLocalization } from '@localizations/server';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import { Alert, AlertTitle, Box } from '@mui/material';
import { ADMINISTRATOR_OR_MANAGE_GUILD, someCheckPermissions, sortGuilds } from '@utils/discord';
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

    const [hasPermission] = await hasDashboardAccess(guild, user);
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

    const [hasPermission, isManager] = await hasDashboardAccess(guild, user);
    if (!hasPermission)
        return (<ForbiddenView />);

    const mutualGuilds = await getAndRequestUserGuildsById(user.id);

    const sortedGuilds = sortGuilds(guilds.filter((guild) => someCheckPermissions(guild, ...ADMINISTRATOR_OR_MANAGE_GUILD))) as OAuthGuild[];

    return (
        <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
            <Navigation
                user={user}
                userManager={isManager}
                userFlags={userFlags}
                guild={guild}
                guildFlags={guildFlags}
                guilds={sortedGuilds}
                mutualGuilds={mutualGuilds.map((mutualGuild) => mutualGuild.id)}
                localization={localization}
            />
            <PageWithSidebarLayout>
                {isManager && <Alert severity="warning" className="mb-6">
                    <AlertTitle>サービスの運営としてアクセスしています！</AlertTitle>
                    現在、あなたはサービスの運営としてこのサーバーのダッシュボードにアクセスしています。<br />
                    このサーバーの管理者よりサポートの要求が行われたなどの理由以外で、本来権限がないサーバーの設定を変更することは禁止されています。
                </Alert>}
                {children}
            </PageWithSidebarLayout>
        </Box>
    );
};

export default Layout;
