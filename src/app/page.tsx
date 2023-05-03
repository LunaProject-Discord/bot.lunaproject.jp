import { getTranslation } from '../localizations/server';
import { getUser } from './utils';
import { View } from './view';

const Page = async () => {
    const translations = getTranslation();

    const user = await getUser();

    return (<View user={user} translations={translations} />);
};

export default Page;
