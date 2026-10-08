'use client';

import { AreaChart } from '@/app/statistics/_components';
import { StatisticsViewProps } from '@/app/statistics/interfaces';
import { formatDate, getDate } from '@/app/statistics/utils';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon } from '@/components/icons';
import { Statistic } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { CircularProgress } from '@mui/material';
import { DateTime } from 'luxon';
import React, { Fragment, useCallback, useMemo } from 'react';

const getPingValue = (statistic: Statistic) => statistic.pings.total;
const getGuildsValue = (statistic: Statistic) => statistic.guilds.total;
const getChannelsValue = (statistic: Statistic) => statistic.channels.total;
const getRolesValue = (statistic: Statistic) => statistic.roles.total;
const getEmojisValue = (statistic: Statistic) => statistic.emojis.total;
const getUsersValue = (statistic: Statistic) => statistic.users.total;
const formatPingValue = (value: number) => `${value.toLocaleString()}ms`;
const formatCountValue = (value: number) => value.toLocaleString();

type Props = StatisticsViewProps & LocalizationProps;

export const View = ({ statistics: { period: { type }, statistics }, localization }: Props) => {
    const { translations } = localization;

    const formatDateTime = useCallback(
        (date: DateTime<true>) => formatDate(date, type, localization),
        [localization, type]
    );

    return (
        <Fragment>
            <PageHeader primary={translations.statistics} secondary={translations.statistics_description} />
            <Section>
                <SectionTitle>{translations.ping}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.ping as string}
                        getDate={getDate}
                        getValue={getPingValue}
                        formatDate={formatDateTime}
                        formatValue={formatPingValue}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.guilds}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.guild as string}
                        getDate={getDate}
                        getValue={getGuildsValue}
                        formatDate={formatDateTime}
                        formatValue={formatCountValue}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.channels}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.channel as string}
                        getDate={getDate}
                        getValue={getChannelsValue}
                        formatDate={formatDateTime}
                        formatValue={formatCountValue}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.roles}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.role as string}
                        getDate={getDate}
                        getValue={getRolesValue}
                        formatDate={formatDateTime}
                        formatValue={formatCountValue}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.emojis}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.emoji as string}
                        getDate={getDate}
                        getValue={getEmojisValue}
                        formatDate={formatDateTime}
                        formatValue={formatCountValue}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translations.users}</SectionTitle>
                <SectionContent>
                    <AreaChart
                        statistics={statistics}
                        label={translations.user as string}
                        getDate={getDate}
                        getValue={getUsersValue}
                        formatDate={formatDateTime}
                        formatValue={formatCountValue}
                    />
                </SectionContent>
            </Section>
        </Fragment>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.statistics} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.statistics} />
        <ErrorRoot sx={{ height: (theme) => `calc(100% - ${theme.spacing(5.25)})` }}>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>{translations.error_data_not_found_title}</ErrorTitle>
            <ErrorDescription>{translations.error_data_not_found_description}</ErrorDescription>
        </ErrorRoot>
    </Fragment>
);
