import { getUser } from '@app/utils';
import { UnauthorizedView } from '@app/view';
import { getUserConfiguration } from '@libs/bot';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { Fragment, ReactNode } from 'react';
import { Navigation } from './navigation';
import { NotFoundView } from './view';

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
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userConfiguration = await getUserConfiguration(user.id);
    if (!userConfiguration)
        return (<NotFoundView />);

    return (
        <Fragment>
            <Navigation user={user} localization={localization} />
            {children}
        </Fragment>
    );
};

export default Layout;
