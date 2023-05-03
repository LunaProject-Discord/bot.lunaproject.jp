import { getTranslation } from '../../localizations/server';
import { LoadingView } from './view';

const Loading = () => {
    const translations = getTranslation();
    return (<LoadingView translations={translations} />);
};

export default Loading;
