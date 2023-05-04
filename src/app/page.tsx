import { getLocalization } from '../localizations/server';
import { getUser } from './utils';
import { View } from './view';

const Page = async () => {
    const localization = getLocalization();

    const user = await getUser();

    return (<View user={user} localization={localization} />);
};

export default Page;
