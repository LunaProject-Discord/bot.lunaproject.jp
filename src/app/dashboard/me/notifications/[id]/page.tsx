import { getUser } from '@/app/utils';
import { NotFoundView, UnauthorizedView } from '@/app/view';
import { GenericPageParamsProps } from '@/interfaces/page';
import { getUserNotification, setUserNotificationRead } from '@/libs/bot';
import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import React from 'react';
import { View } from './view';

export const generateMetadata = async (props: GenericPageParamsProps, parent: ResolvingMetadata) => {
    const { id } = await props.params;

    const user = await getUser();
    if (!user)
        return parent;

    const userNotification = await getUserNotification(user.id, id);
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
const Page = async (props: GenericPageParamsProps) => {
    const { id } = await props.params;

    const localization = await getLocalization();

    const user = await getUser();
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userNotification = await getUserNotification(user.id, id);
    if (!userNotification)
        return (<NotFoundView localization={localization} />);

    await setUserNotificationRead(user.id, id, true);

    return (<View user={user} notification={userNotification} localization={localization} />);
};

export default Page;
