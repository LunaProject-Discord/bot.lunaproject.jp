'use client';

import { PageContent, PageHeader } from '@components/layout';
import { GuildLevel } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section } from '@lunaproject-discord/web-core/dist/components/Section';
import { borderAndBoxShadow } from '@lunaproject-discord/web-core/dist/utils/theme';
import { CloudOffOutlined, SearchOutlined, TableRowsOutlined } from '@mui/icons-material';
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
import { filterPredicateMember } from '@utils/discord';
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { DesktopLevelItemRoot, LevelItem } from './components';

interface Props extends GuildConfigurationViewProps {
    levels: GuildLevel[];
}

export const View = ({ guild, levels, localization }: Props) => {
    const { translations } = localization;

    const [pageIndex, setPageIndex] = useState(0);
    const [perPageLimit, setPerPageLimit] = useState(50);

    const [search, setSearch] = useState('');

    const filteredLevels = levels.filter((level) => guild.members.some((member) => member.user.id === level.user.id && filterPredicateMember(member, search)));
    const levelPages = new Array(Math.ceil(filteredLevels.length / perPageLimit)).fill(undefined).map((_, i) => filteredLevels.slice(i * perPageLimit, (i + 1) * perPageLimit));
    const data = (search.length < 1 ? levelPages[pageIndex] : filteredLevels) ?? [];

    const handlePageIndexChange = (e: MouseEvent<HTMLButtonElement> | null, index: number) => setPageIndex(index);

    const handlePerPageLimitChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPageLimit(Number(e.target.value));
        setPageIndex(0);
    };

    if (search.length < 1 && data.length < 1)
        return (<DataEmptyView localization={localization} />);

    return (
        <PageContent sx={search.length > 0 && data.length < 1 ? { display: 'flex', gap: 0 } : undefined}>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.leaderboard}</Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            src={getGuildIcon(guild)}
                            alt=" "
                            sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                        />
                        {guild.name}
                    </Typography>
                </Box>
            </PageHeader>
            <Box
                sx={{
                    width: '100%',
                    pt: 3,
                    pb: { xs: 3, md: 0 },
                    position: 'sticky',
                    top: { xs: 56, md: 0 },
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
                        <SearchOutlined color="action" />
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
                        labelRowsPerPage={<TableRowsOutlined />}
                        SelectProps={{
                            MenuProps: {
                                slotProps: {
                                    paper: {
                                        sx: (theme) => borderAndBoxShadow(theme)
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
                {data.map((level) => {
                    const member = guild.members.find((member) => member.user.id === level.user.id)!!;

                    return (
                        <LevelItem
                            key={level.user.id}
                            guild={guild}
                            member={member}
                            data={level}
                            localization={localization}
                        />
                    );
                })}
            </Section> : <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    placeItems: 'center',
                    placeContent: 'center',
                    gap: 1
                }}
            >
                <CloudOffOutlined color="primary" sx={{ fontSize: '10rem' }} />
                <Typography variant="h4">メンバーが見つかりません</Typography>
                <Typography align="center">
                    指定したキーワードに合うメンバーが見つかりませんでした。<br />
                    検索キーワードを変更して再度お試しください。
                </Typography>
            </Box>}
        </PageContent>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.leaderboard}</Typography>
                <Typography>{translations.loading}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageContent>
);

export const NotFoundView = ({}: LocalizationProps) => (
    <PageContent display="flex">
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                placeContent: 'center',
                gap: 1
            }}
        >
            <CloudOffOutlined color="primary" sx={{ fontSize: '10rem' }} />
            <Typography variant="h4">サーバーが見つかりません</Typography>
            <Typography align="center">
                指定されたサーバーが見つかりませんでした。<br />
                あなたはそのサーバーの管理者ではないか、サーバーが存在しない可能性があります。<br />
                サーバーが存在していることが明らかな場合は、ほかのアカウントに切り替えて再度お試しください。
            </Typography>
        </Box>
    </PageContent>
);

export const DataEmptyView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.leaderboard}</Typography>
                <Typography />
            </Box>
        </PageHeader>
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                placeContent: 'center',
                gap: 1
            }}
        >
            <CloudOffOutlined color="primary" sx={{ fontSize: '10rem' }} />
            <Typography variant="h4">データがありません</Typography>
            <Typography align="center">
                このサーバーではまだ誰も発言していないようです...<br />
                サーバーで発言してから少し待った後に再度お試しください。
            </Typography>
        </Box>
    </PageContent>
);
