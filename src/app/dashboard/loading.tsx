import { getLocalization } from '../../localizations/server';
import { LoadingView } from './view';

const Loading = () => {
    const localization = getLocalization();
    return (<LoadingView localization={localization} />);
};

export default Loading;
