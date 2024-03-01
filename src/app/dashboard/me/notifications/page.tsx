import { getUser } from '@/app/utils';
import { UnauthorizedView } from '@/app/view';
import { getUserNotifications } from '@/libs/bot';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.notifications;

    const user = await getUser();
    if (!user)
        return parent;

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

    const userNotifications = await getUserNotifications(user.id);

    return (<View user={user} notifications={userNotifications} localization={localization} />);
};

export default Page;
