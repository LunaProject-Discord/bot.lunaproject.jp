import { getLocalization } from '@localizations/server';
import { NotFoundView } from './view';

const Page = () => {
    const localization = getLocalization();
    return (<NotFoundView localization={localization} />);
};

export default Page;
