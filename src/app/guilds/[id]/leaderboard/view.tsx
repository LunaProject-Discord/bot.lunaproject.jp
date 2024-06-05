'use client';

import { LevelProfileCard, LevelRewardsCard } from '@/app/guilds/[id]/leaderboard/components';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon, KeyboardArrowRightIcon, SearchIcon } from '@/components/icons';
import { SectionLevelView, SectionLevelViewHeader } from '@/components/section';
import { GuildLevel } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { RedisMember } from '@/interfaces/redis';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { filterPredicateLevel } from '@/utils/level';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PageHeader, PageLayout } from '@lunaproject/web-core/dist/components/Layout';
import { useDebounce } from '@lunaproject/web-core/dist/utils';
import { Box, InputBase, Unstable_Grid2 as Grid } from '@mui/material';
import NextLink from 'next/link';
import React, { useState } from 'react';

interface Props extends GuildConfigurationViewProps {
    member: RedisMember | undefined;
    levels: GuildLevel[];
    dashboardAccessible: boolean;
}

export const View = ({ guild, member, levels, dashboardAccessible, configuration, localization }: Props) => {
    const { translations } = localization;

    const [search, setSearch] = useState('');
    const keyword = useDebounce(search, 500);

    const filteredLevels = levels.filter((level) => filterPredicateLevel(level, keyword));

    if (keyword.length < 1 && filteredLevels.length < 1)
        return (<DataEmptyView localization={localization} />);

    const level = levels.find((level) => level.user.id === member?.id);
    return (
        <Grid container spacing={2}>
            {(dashboardAccessible || (level && level.member)) && <Grid
                xs={12}
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {dashboardAccessible && <Button
                    component={NextLink}
                    href={`/dashboard/${guild.id}/level/manage`}
                    variant="outlined"
                    corners="extended"
                    size="large"
                    fullWidth
                    endIcon={<KeyboardArrowRightIcon />}
                    sx={{ justifyContent: 'space-between' }}
                >
                    {translations.level_manage}
                </Button>}
                {(level && level.member) && <LevelProfileCard
                    level={level as Required<GuildLevel>}
                    guild={guild}
                    localization={localization}
                />}
            </Grid>}
            <Grid xs={12} md={8} lg={9}>
                <Box
                    sx={(theme) => ({
                        width: '100%',
                        mt: -2,
                        pt: 2,
                        pb: { xs: 2, md: .75 },
                        position: 'sticky',
                        top: { xs: theme.spacing(7 + 6), sm: theme.spacing(8 + 6) },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        zIndex: 1,
                        bgcolor: 'background.paper'
                    })}
                >
                    <Box
                        sx={{
                            width: '100%',
                            px: 1.5,
                            py: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                            borderRadius: 1
                        }}
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
            </Grid>
            <Grid xs={12} sx={{ display: { md: 'none' } }}>
                <LevelRewardsCard
                    level={level?.level}
                    type={configuration.level.reward.type}
                    roles={configuration.level.reward.roles}
                    guild={guild}
                    localization={localization}
                />
            </Grid>
            <Grid xs={12} md={4} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                {dashboardAccessible && <Button
                    component={NextLink}
                    href={`/dashboard/${guild.id}/level/manage`}
                    variant="outlined"
                    corners="extended"
                    size="large"
                    fullWidth
                    endIcon={<KeyboardArrowRightIcon />}
                    sx={{ justifyContent: 'space-between' }}
                >
                    {translations.level_manage}
                </Button>}
                <Box
                    sx={{
                        mt: !dashboardAccessible ? -2 : 0,
                        pt: 2,
                        position: 'sticky',
                        top: { sm: (8 * 8) + (8 * 6) },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    {(level && level.member) && <LevelProfileCard
                        level={level as Required<GuildLevel>}
                        guild={guild}
                        localization={localization}
                    />}
                    {configuration.level.reward.roles.filter((role) => role.enabled).length > 0 && <LevelRewardsCard
                        level={level?.level}
                        type={configuration.level.reward.type}
                        roles={configuration.level.reward.roles}
                        guild={guild}
                        localization={localization}
                    />}
                </Box>
            </Grid>
        </Grid>
    );
};

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
