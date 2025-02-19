import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next';
import { NotFoundView } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = await getLocalization();
    const title = translations.error_not_found_title;

    const metadata = await parent;
    return {
        ...metadata,
        title
    };
};

const Page = async () => {
    const localization = await getLocalization();
    return (<NotFoundView localization={localization} />);
};

export default Page;
