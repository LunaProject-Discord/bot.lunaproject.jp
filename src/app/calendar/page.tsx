import { getTranslation } from '../../localizations/server';
import { View } from './view';

const Page = async () => {
    const translations = getTranslation();

    return (<View translations={translations} />);
};

export default Page;
