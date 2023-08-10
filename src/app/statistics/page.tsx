import { StatisticsPageProps } from '@app/statistics/interfaces';
import { getPeriod } from '@app/statistics/utils';
import { getPeriodStatistics } from '@libs/bot';
import { getLocalization } from '@localizations/server';
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';
import { NotFoundView, View } from './view';

export const generateMetadata = async ({}, parent: ResolvingMetadata) => {
    const { translations } = getLocalization();
    const title = translations.statistics;
    const description = translations.statistics_description;

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

const Page = async (props: StatisticsPageProps) => {
    const localization = getLocalization();

    const { type, startedAt, endedAt } = getPeriod(props);
    const statistics = await getPeriodStatistics(type, { start: startedAt, end: endedAt });
    if (!statistics)
        return (<NotFoundView localization={localization} />);

    return (<View statistics={statistics} localization={localization} />);
};

export default Page;
