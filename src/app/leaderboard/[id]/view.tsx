'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@components/error';
import {
    CloudOffIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
    SearchIcon,
    TableRowsIcon
} from '@components/icons';
import { PageCenteredLayout, PageHeader, PageLayout } from '@components/layout_v2';
import { GuildLevel } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { borderAndBoxShadow } from '@lunaproject/web-core/dist/utils/theme';
import {
    Avatar,
    Box,
    CircularProgress,
    InputBase,
    TablePagination,
    tablePaginationClasses,
    Typography
} from '@mui/material';
import { getGuildIcon } from '@utils/cdn';
import { filterPredicateLevel, getLevelPages } from '@utils/level';
import { useDebounce } from '@utils/react/debounce';
import React, { ChangeEvent, Fragment, MouseEvent, useState } from 'react';
import { DesktopLevelItemRoot, LevelItem } from './components';

interface Props extends GuildConfigurationViewProps {
    levels: GuildLevel[];
}

export const View = ({ guild, levels, localization }: Props) => {
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
                    pb: { xs: 2, md: 0 },
                    position: 'sticky',
                    top: { xs: theme.spacing(7), sm: theme.spacing(8) },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    zIndex: 1,
                    bgcolor: 'background.paper'
                })}
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
                        slots={{
                            actions: {
                                nextButtonIcon: KeyboardArrowRightIcon,
                                previousButtonIcon: KeyboardArrowLeftIcon
                            }
                        }}
                        slotProps={{
                            select: {
                                MenuProps: {
                                    slotProps: {
                                        paper: {
                                            sx: (theme) => borderAndBoxShadow(theme)
                                        }
                                    }
                                }
                            }
                        }}
                        sx={{
                            flexShrink: 0,
                            userSelect: 'none',
                            border: 'none',
                            [`& .${tablePaginationClasses.toolbar}`]: {
                                p: 0
                            },
                            [`& .${tablePaginationClasses.selectLabel}`]: {
                                lineHeight: 0
                            }
                        }}
                    />
                </Box>
                <DesktopLevelItemRoot>
                    <Typography variant="body2" align="center">{translations.rank}</Typography>
                    <Typography variant="body2" sx={{ gridColumn: 3 }}>{translations.member}</Typography>
                    <Typography variant="body2" align="center">{translations.level}</Typography>
                    <Typography variant="body2" align="center">{translations.experience}</Typography>
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

export const NotFoundView = ({}: LocalizationProps) => (
    <PageCenteredLayout>
        <ErrorRoot>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>サーバーが見つかりません</ErrorTitle>
            <ErrorDescription>
                指定されたサーバーが見つかりませんでした。<br />
                あなたはそのサーバーの管理者ではないか、サーバーが存在しない可能性があります。<br />
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </ErrorDescription>
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
