import { LayoutHeader, LayoutNavigation } from '@/app/guilds/[id]/components';
import { getUser } from '@/app/utils';
import { WithIdParamProps } from '@/interfaces/page';
import { getGuildConfiguration, hasDashboardAccess, isLeaderboardAccessible } from '@/libs/bot';
import { getGuildById, getMemberById } from '@/libs/redis';
import { getLocalization } from '@/localizations/server';
import { PageLayout } from '@lunaproject/web-core/dist/components/Layout';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { notFound } from 'next/navigation';
import React, { Fragment, ReactNode } from 'react';
import { NotFoundView } from './view';

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
            default: `${guild.name}`,
            template: `%s [${guild.name}] | 結月 -ゆづき-`
        },
        openGraph: {
            ...metadata.openGraph,
            title: {
                default: `${guild.name}`,
                template: `%s [${guild.name}]`
            }
        },
        twitter: {
            ...metadata.twitter,
            title: {
                default: `${guild.name}`,
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

    const guildData = getGuildById(id);
    const guildConfigurationData = getGuildConfiguration(id);

    const [user, guild, guildConfiguration] = await Promise.all([
        userData,
        guildData,
        guildConfigurationData
    ]);

    if (!guild || !guildConfiguration)
        return (<NotFoundView localization={localization} />);

    const member = user ? await getMemberById(user.id, guild.id) : undefined;
    const allowLeaderboard = await isLeaderboardAccessible(user, guild, guildConfiguration);
    const allowDashboard = user ? await hasDashboardAccess(guild, user) : false;

    return (
        <Fragment>
            <LayoutHeader guild={guild} member={member} localization={localization} />
            <LayoutNavigation
                guild={guild}
                configuration={guildConfiguration}
                leaderboardAccessible={allowLeaderboard}
                dashboardAccessible={allowDashboard}
                localization={localization}
            />
            <PageLayout>{children}</PageLayout>
        </Fragment>
    );
};

export default Layout;
