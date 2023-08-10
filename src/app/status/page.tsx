import { getHoursStatistics, getLatestStatistic } from '@libs/bot';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { NotFoundView, View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.status;
    const description = translations.status_description;

    const metadata = await parent;
    return {
        ...metadata,
        title,
        description,
        openGraph: {
            ...metadata.openGraph,
            title,
            description
        },
        twitter: {
            ...metadata.twitter,
            title,
            description
        }
    };
};

const Page = async () => {
    const localization = getLocalization();

    const statistic = await getLatestStatistic();
    const statistics = await getHoursStatistics();
    console.log(statistic, statistics);

    if (!statistic)
        return (<NotFoundView localization={localization} />);

    return (<View statistic={statistic} localization={localization} />);
};

export default Page;
