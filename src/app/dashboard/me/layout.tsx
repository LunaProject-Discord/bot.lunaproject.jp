import { getUser } from '@/app/utils';
import { NotFoundView, UnauthorizedView } from '@/app/view';
import { getUserConfiguration, getUserFlags } from '@/libs/bot';
import { getLocalization } from '@/localizations/server';
import { PageSidebarLayout, RootSidebarLayout } from '@lunaproject/web-core/dist/components/Layout';
import { ResolvingMetadata } from 'next';
import React, { ReactNode } from 'react';
import { Navigation } from './navigation';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = await getLocalization();

    const user = await getUser();
    if (!user)
        return parent;

    const metadata = await parent;
    return {
        ...metadata,
        title: {
            default: translations.user_settings,
            template: `%s [${translations.user_settings}] | 結月 -ゆづき-`
        },
        openGraph: {
            ...metadata.openGraph,
            title: {
                default: translations.user_settings,
                template: `%s [${translations.user_settings}]`
            }
        },
        twitter: {
            ...metadata.twitter,
            title: {
                default: translations.user_settings,
                template: `%s [${translations.user_settings}]`
            }
        },
        robots: {
            ...metadata.robots,
            index: false
        }
    };
};

const Layout = async ({ children }: { children: ReactNode }) => {
    const localization = await getLocalization();

    const user = await getUser();
    const userFlags = user ? await getUserFlags(user.id) : undefined;
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userConfiguration = await getUserConfiguration(user.id);
    if (!userConfiguration)
        return (<NotFoundView localization={localization} />);

    return (
        <RootSidebarLayout>
            <Navigation user={user} flags={userFlags} localization={localization} />
            <PageSidebarLayout sx={{ pb: 8 }}>{children}</PageSidebarLayout>
        </RootSidebarLayout>
    );
};

export default Layout;
