import { getUser } from '@app/utils';
import { UnauthorizedView } from '@app/view';
import { PageWithSidebarLayout } from '@components/layout_v2';
import { getUserFlags } from '@libs/bot';
import { getLocalization } from '@localizations/server';
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
    const localization = getLocalization();

    const user = await getUser();
    const userFlags = user ? await getUserFlags(user.id) : undefined;
    if (!user || !userFlags || !userFlags.manager)
        return (<UnauthorizedView localization={localization} />);

    return (
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
            <Navigation user={user} flags={userFlags} localization={localization} />
            <PageWithSidebarLayout>{children}</PageWithSidebarLayout>
        </Box>
    );
};

export default Layout;
