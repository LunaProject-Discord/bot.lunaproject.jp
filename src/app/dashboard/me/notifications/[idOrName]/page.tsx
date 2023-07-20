import { getUser } from '@app/utils';
import { UnauthorizedView } from '@app/view';
import { getUserNotificationById, getUserNotificationByName } from '@libs/bot';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { NotFoundView } from '../../view';
import { View } from './view';

interface Props {
    params: {
        idOrName: string | number;
    };
}

export const generateMetadata = async ({ params: { idOrName } }: Props, parent: ResolvingMetadata) => {
    const user = await getUser();
    if (!user)
        return parent;

    const userNotification = await (typeof idOrName === 'string' ? getUserNotificationByName(user.id, idOrName) : getUserNotificationById(idOrName));
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
const Page = async ({ params: { idOrName } }: Props) => {
    const localization = getLocalization();

    const user = await getUser();
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userNotification = await (typeof idOrName === 'string' ? getUserNotificationByName(user.id, idOrName) : getUserNotificationById(idOrName));
    if (!userNotification)
        return (<NotFoundView />);

    return (<View user={user} notification={userNotification} localization={localization} />);
};

export default Page;
