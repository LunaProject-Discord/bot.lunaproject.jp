import { ErrorDescription, ErrorRoot, ErrorTitle } from '@components/error';
import { CloudOffIcon } from '@components/icons';
import { PageCenteredLayout, PageLayout } from '@components/layout_v2';
import { LocalizationProps } from '@interfaces/localization';
import { GuildViewProps } from '@interfaces/view';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { CircularProgress } from '@mui/material';
import React, { Fragment } from 'react';

export const View = ({ guild, localization }: GuildViewProps) => {
    return (
        <Fragment>
        </Fragment>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageLayout>
);

export const NotFoundView = ({}: LocalizationProps) => (
    <PageCenteredLayout>
        <ErrorRoot>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>サーバーが見つかりません</ErrorTitle>
            <ErrorDescription>
                指定されたサーバーが見つかりませんでした。<br />
                あなたはそのサーバーに参加していないか、サーバーが存在しない可能性があります。<br />
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </ErrorDescription>
        </ErrorRoot>
    </PageCenteredLayout>
);
