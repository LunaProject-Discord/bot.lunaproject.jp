import { getUser } from '@app/utils';
import { NotFoundView, UnauthorizedView } from '@app/view';
import { getUserConfiguration } from '@libs/bot';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.time_and_language;

    const metadata = await parent;
    return {
        ...metadata,
        title,
        openGraph: {
            ...metadata.openGraph,
            title
        },
        twitter: {
            ...metadata.twitter,
            title
        }
    };
};

const Page = async () => {
    const localization = getLocalization();

    const user = await getUser();
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userConfiguration = await getUserConfiguration(user.id);
    if (!userConfiguration)
        return (<NotFoundView localization={localization} />);

    return (<View user={user} configuration={userConfiguration} localization={localization} />);
};

export default Page;
