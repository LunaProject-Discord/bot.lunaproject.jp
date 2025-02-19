import { getLocalization } from '@/localizations/server';
import { LoadingView } from './view';

const Page = async () => {
    const localization = await getLocalization();
    return (<LoadingView localization={localization} />);
};

export default Page;
