import { getLocalization } from '@/localizations/server';
import { LoadingView } from './view';

const Loading = async () => {
    const localization = await getLocalization();
    return (<LoadingView localization={localization} />);
};

export default Loading;
