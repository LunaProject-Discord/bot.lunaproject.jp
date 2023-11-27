import { getUser } from '@app/utils';
import { UnauthorizedView } from '@app/view';
import { WithIdParamProps } from '@interfaces/page';
import { getUserNotificationById, setUserNotificationRead } from '@libs/bot';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { NotFoundView } from '../../view';
import { View } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const user = await getUser();
    if (!user)
        return parent;

    const userNotification = await getUserNotificationById(user.id, id);
    if (!userNotification)
        return parent;

    const metadata = await parent;
    return {
        ...metadata,
        title: userNotification.title,
        openGraph: {
            ...metadata.openGraph,
            title: userNotification.title
        },
        twitter: {
            ...metadata.twitter,
            title: userNotification.title
        }
    };
};
const Page = async ({ params: { id } }: WithIdParamProps) => {
    const localization = getLocalization();

    const user = await getUser();
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userNotification = await getUserNotificationById(user.id, id);
    if (!userNotification)
        return (<NotFoundView />);

    await setUserNotificationRead(user.id, id, true);

    return (<View user={user} notification={userNotification} localization={localization} />);
};

export default Page;
