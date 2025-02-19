import { getUser } from '@/app/utils';
import { UnauthorizedView } from '@/app/view';
import { getUserFlags } from '@/libs/bot';
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
            default: translations.statistics,
            template: `%s [${translations.statistics}] | 結月 -ゆづき-`
        },
        openGraph: {
            ...metadata.openGraph,
            title: {
                default: translations.statistics,
                template: `%s [${translations.statistics}]`
            }
        },
        twitter: {
            ...metadata.twitter,
            title: {
                default: translations.statistics,
                template: `%s [${translations.statistics}]`
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

    if (!user || !userFlags || !userFlags.manager)
        return (<UnauthorizedView localization={localization} />);

    return (
        <RootSidebarLayout>
            <Navigation user={user} flags={userFlags} localization={localization} />
            <PageSidebarLayout>{children}</PageSidebarLayout>
        </RootSidebarLayout>
    );
};

export default Layout;
