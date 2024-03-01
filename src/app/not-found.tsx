import { getLocalization } from '@/localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { NotFoundView } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.error_not_found_title;

    const metadata = await parent;
    return {
        ...metadata,
        title
    };
};

const Page = () => {
    const localization = getLocalization();
    return (<NotFoundView localization={localization} />);
};

export default Page;
