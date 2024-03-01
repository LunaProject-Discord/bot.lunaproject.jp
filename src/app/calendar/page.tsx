import { getLocalization } from '@/localizations/server';
import { View } from './view';

const Page = async () => {
    const localization = getLocalization();
    return (<View localization={localization} />);
};

export default Page;
