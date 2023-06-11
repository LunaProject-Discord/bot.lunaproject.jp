import { getLocalization } from '@localizations/server';
import { LoadingView } from './view';

const Page = () => {
    const localization = getLocalization();
    return (<LoadingView localization={localization} />);
};

export default Page;
