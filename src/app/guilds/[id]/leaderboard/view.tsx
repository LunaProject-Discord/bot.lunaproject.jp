'use client';

import { DesktopLevelItemRoot, LevelItem } from '@app/leaderboard/[id]/components';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@components/error';
import { CloudOffIcon, SearchIcon, TableRowsIcon } from '@components/icons';
import { PageHeader, PageLayout } from '@components/layout_v2';
import { GuildLevel } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { RedisMember } from '@interfaces/redis';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import {
    Box,
    InputBase,
    LinearProgress,
    Paper,
    TablePagination,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { filterPredicateLevel, getLevelPages, getMaxExperience } from '@utils/level';
import { useDebounce } from '@utils/react/debounce';
import React, { ChangeEvent, MouseEvent, useState } from 'react';

interface Props extends GuildConfigurationViewProps {
    member: RedisMember | undefined;
    levels: GuildLevel[];
}

export const View = ({ guild, member, levels, localization }: Props) => {
    const { translations } = localization;

    const [pageIndex, setPageIndex] = useState(0);
    const [perPageLimit, setPerPageLimit] = useState(50);

    const [search, setSearch] = useState('');
    const keyword = useDebounce(search, 500);

    const filteredLevels = levels.filter((level) => filterPredicateLevel(level, keyword));
    const levelPages = getLevelPages(filteredLevels, perPageLimit);
    const data = (keyword.length < 1 ? levelPages[pageIndex] : filteredLevels) ?? [];

    const handlePageIndexChange = (e: MouseEvent<HTMLButtonElement> | null, index: number) => setPageIndex(index);

    const handlePerPageLimitChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPageLimit(Number(e.target.value));
        setPageIndex(0);
    };

    if (keyword.length < 1 && data.length < 1)
        return (<DataEmptyView localization={localization} />);

    const level = data.find((level) => level.user.id === member?.id);
    return (
        <Grid container spacing={2}>
            <Grid xs={12} md={9}>
                <Box
                    sx={{
                        width: '100%',
                        mt: -2,
                        pt: 2,
                        pb: { xs: 2, md: 0 },
                        position: 'sticky',
                        top: { xs: (8 * 7) + (8 * 8) + 1, sm: ((8 * 8) * 2) + 1 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        zIndex: 1,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: 2
                        }}
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
                        <TablePagination
                            component={Box}
                            count={filteredLevels.length}
                            page={pageIndex}
                            onPageChange={handlePageIndexChange}
                            rowsPerPage={perPageLimit}
                            onRowsPerPageChange={handlePerPageLimitChange}
                            labelRowsPerPage={<TableRowsIcon />}
                        />
                    </Box>
                    <DesktopLevelItemRoot>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {translations.rank}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ gridColumn: 3 }}>
                            {translations.member}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {translations.level}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {translations.experience}
                        </Typography>
                    </DesktopLevelItemRoot>
                </Box>
                {data.length > 0 ? <Section sx={{ p: 0, pt: { md: 1 }, gap: 1 }}>
                    {data.map((level) => (
                        <LevelItem
                            key={level.user.id}
                            guild={guild}
                            level={level}
                            localization={localization}
                        />
                    ))}
                </Section> : <ErrorRoot>
                    <CloudOffIcon sx={{ fontSize: '10rem' }} />
                    <ErrorTitle>メンバーが見つかりません</ErrorTitle>
                    <ErrorDescription>
                        指定したキーワードに合うメンバーが見つかりませんでした。<br />
                        検索キーワードを変更して再度お試しください。
                    </ErrorDescription>
                </ErrorRoot>}
            </Grid>
            <Grid xs={12} md={3} sx={{ order: { xs: -1, md: 0 } }}>
                {level && <Box
                    sx={{
                        mt: -2,
                        pt: 2,
                        position: 'sticky',
                        top: { xs: (8 * 7) + (8 * 8) + 1, sm: ((8 * 8) * 2) + 1 }
                    }}
                >
                    <Paper
                        variant="outlined"
                        elevation={0}
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: .5
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            暫定順位
                        </Typography>
                        <Typography variant="h4" sx={{ fontFamily: 'Renner, sans-serif' }}>
                            {level.rank}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <Typography>
                                レベル
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                {level.level}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <Typography>
                                経験値
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                {level.experience}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <Typography>
                                次のレベルまでに必要な経験値
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                {getMaxExperience(level.level) - level.experience}
                            </Typography>
                        </Box>
                        <LinearProgress
                            value={(level.experience / getMaxExperience(level.level)) * 100}
                            variant="determinate"
                        />
                    </Paper>
                </Box>}
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
