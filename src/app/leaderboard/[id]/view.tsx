'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon, SearchIcon } from '@/components/icons';
import { SectionLevelView, SectionLevelViewHeader } from '@/components/section';
import { GuildLevel } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { getGuildIcon } from '@/utils/cdn';
import { filterPredicateLevel } from '@/utils/level';
import { PageCenteredLayout, PageHeader, PageLayout } from '@lunaproject/web-core/dist/components/Layout';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { useDebounce } from '@lunaproject/web-core/dist/utils';
import { Avatar, Box, CircularProgress, InputBase } from '@mui/material';
import React, { Fragment, useState } from 'react';

interface Props extends GuildConfigurationViewProps {
    levels: GuildLevel[];
}

export const View = ({ guild, levels, localization }: Props) => {
    const { translations } = localization;

    const [search, setSearch] = useState('');
    const keyword = useDebounce(search, 500);

    const filteredLevels = levels.filter((level) => filterPredicateLevel(level, keyword));

    if (keyword.length < 1 && filteredLevels.length < 1)
        return (<DataEmptyView localization={localization} />);

    return (
        <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
            <PageHeader
                primary={translations.leaderboard}
                secondary={
                    <Fragment>
                        <Avatar
                            src={getGuildIcon(guild)}
                            alt=" "
                            sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                        />
                        {guild.name}
                    </Fragment>
                }
                secondaryTypographyProps={{ sx: { display: 'flex', alignItems: 'center', gap: 1 } }}
            />
            <Box
                sx={(theme) => ({
                    width: '100%',
                    pt: 2,
                    pb: { xs: 2, md: .75 },
                    position: 'sticky',
                    top: { xs: theme.spacing(7), sm: theme.spacing(8) },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    zIndex: 1,
                    bgcolor: 'background.paper'
                })}
            >
                <Box
                    sx={(theme) => ({
                        width: '100%',
                        px: 1.5,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: theme.vars.palette.grey[100],
                        borderRadius: 1,
                        ...theme.applyStyles('dark', {
                            bgcolor: theme.vars.palette.grey[900]
                        })
                    })}
                >
                    <SearchIcon color="action" />
                    <InputBase
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={translations.search_members as string}
                        fullWidth
                    />
                </Box>
                <SectionLevelViewHeader localization={localization} />
            </Box>
            {filteredLevels.length > 0 ? <SectionLevelView
                guild={guild}
                levels={filteredLevels}
                localization={localization}
            /> : <ErrorRoot>
                <CloudOffIcon sx={{ fontSize: '10rem' }} />
                <ErrorTitle>{translations.error_member_not_found_title}</ErrorTitle>
                <ErrorDescription>{translations.error_member_not_found_description}</ErrorDescription>
            </ErrorRoot>}
        </PageLayout>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
        <PageHeader primary={translations.leaderboard} secondary={translations.loading} />
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

export const DataEmptyView = ({ localization: { translations } }: LocalizationProps) => (
    <PageLayout sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
        <PageHeader primary={translations.leaderboard} />
        <ErrorRoot>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>データがありません</ErrorTitle>
            <ErrorDescription>
                このサーバーではまだ誰も発言していないようです...<br />
                サーバーで発言してからしばらく待った後に再度お試しください。
            </ErrorDescription>
        </ErrorRoot>
    </PageLayout>
);
