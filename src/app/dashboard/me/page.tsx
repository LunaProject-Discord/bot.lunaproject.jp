import { getUser } from '@/app/utils';
import { UnauthorizedView } from '@/app/view';
import { getUserNotifications } from '@/libs/bot';
import { getLocalization } from '@/localizations/server';
import React from 'react';
import { View } from './view';

const Page = async () => {
    const localization = getLocalization();

    const user = await getUser();
    if (!user)
        return (<UnauthorizedView localization={localization} />);

    const userNotifications = await getUserNotifications(user.id);

    return (
        <View
            user={user}
            notifications={userNotifications}
            localization={localization}
        />
    );
};

export default Page;
