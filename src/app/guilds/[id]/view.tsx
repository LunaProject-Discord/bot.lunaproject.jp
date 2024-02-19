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

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <PageCenteredLayout>
        <ErrorRoot>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>{translations.error_guild_not_found_title}</ErrorTitle>
            <ErrorDescription>{translations.error_guild_not_found_description}</ErrorDescription>
        </ErrorRoot>
    </PageCenteredLayout>
);
