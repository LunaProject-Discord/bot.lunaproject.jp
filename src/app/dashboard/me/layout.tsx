import { getUser } from '@/app/utils';
import { NotFoundView, UnauthorizedView } from '@/app/view';
import { PageWithSidebarLayout } from '@/components/layout_v2';
import { getUserConfiguration, getUserFlags } from '@/libs/bot';
import { getLocalization } from '@/localizations/server';
import { Box } from '@mui/material';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { ReactNode } from 'react';
import { Navigation } from './navigation';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();

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
    const localization = getLocalization();

    const user = await getUser();
    const userFlags = user ? await getUserFlags(user.id) : undefined;
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userConfiguration = await getUserConfiguration(user.id);
    if (!userConfiguration)
        return (<NotFoundView localization={localization} />);

    return (
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
            <Navigation user={user} flags={userFlags} localization={localization} />
            <PageWithSidebarLayout sx={{ pb: 8 }}>{children}</PageWithSidebarLayout>
        </Box>
    );
};

export default Layout;
