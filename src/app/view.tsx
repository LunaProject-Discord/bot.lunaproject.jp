'use client';

import {
    Gallery,
    GalleryItem,
    GalleryItemIcon,
    GalleryItemText
} from '@lunaproject-discord/web-core/dist/components/Gallery';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { SegmentedControl } from '@lunaproject-discord/web-core/dist/components/SegmentedControl';
import { OAuthGuild, OAuthUser } from '@lunaproject-discord/web-discord';
import {
    AnalyticsOutlined,
    AutoAwesomeOutlined,
    CloudOffOutlined,
    DnsOutlined,
    HomeOutlined,
    LeaderboardOutlined,
    LockPersonOutlined,
    LoginOutlined,
    PersonOffOutlined,
    SettingsOutlined
} from '@mui/icons-material';
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    ButtonBase,
    CircularProgress,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import Link from 'next/link';
import NextLink from 'next/link';
import { parseCookies } from 'nookies';
import React, { Fragment, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { PageContent } from '../components/layout';
import { FeaturedGuild } from '../interfaces/bot';
import { LocalizationProps } from '../interfaces/localization';
import { getGuildIcon } from '../utils/discord';
import { fetchWithUser } from '../utils/swr';

interface GuildsProps {
    guilds: OAuthGuild[];
}

const GuildsGalleryView = ({ guilds }: GuildsProps) => (
    <Gallery>
        {guilds.map((guild) => (
            <GalleryItem key={guild.id}>
                <ButtonBase component={NextLink} href={`/dashboard/${guild.id}`}>
                    <GalleryItemIcon>
                        <Avatar
                            src={getGuildIcon(guild)}
                            alt={guild.name}
                            sx={{ width: 100, height: 100 }}
                        />
                    </GalleryItemIcon>
                    <GalleryItemText>{guild.name}</GalleryItemText>
                </ButtonBase>
            </GalleryItem>
        ))}
    </Gallery>
);

const GuildsTableView = ({ guilds }: GuildsProps) => (
    <List>
        {guilds.map((guild) => (
            <ListItemButton
                key={guild.id}
                component={NextLink}
                href={`/dashboard/${guild.id}`}
                sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                }}
            >
                <ListItemIcon>
                    <Avatar
                        src={getGuildIcon(guild)}
                        alt={guild.name}
                    />
                </ListItemIcon>
                <ListItemText primary={guild.name} />
            </ListItemButton>
        ))}
    </List>
);

type ViewType = 'features' | 'guilds';

interface Props extends LocalizationProps {
    user: OAuthUser | undefined;
}

export const View = ({ user, localization: { translations } }: Props) => {
    const cookies = parseCookies();
    const token = cookies['token'];

    const { data: guilds } = useSWRImmutable<FeaturedGuild[]>(
        token ? ['/api/users/me/home/guilds', token] : null,
        ([url, token]: string[]) => fetchWithUser(url, token)
    );

    const [viewState, setViewState] = useState<ViewType>('guilds');

    return (
        <PageContent>
            <Typography variant="h4">ようこそ</Typography>
            <Alert severity="warning" sx={{ mt: 3 }}>
                <AlertTitle>警告</AlertTitle>
                このサイトは現在開発中です。大部分は利用できません。
            </Alert>
            {user ? (
                <Section sx={{ gap: 3 }}>
                    <Box sx={{ width: 'fit-content' }}>
                        <SegmentedControl<ViewType>
                            value={viewState}
                            setValue={setViewState}
                            choices={[
                                {
                                    value: 'features',
                                    children: <Fragment>
                                        <AutoAwesomeOutlined sx={{ ml: -.75 }} />
                                        機能から探す
                                    </Fragment>
                                },
                                {
                                    value: 'guilds',
                                    children: <Fragment>
                                        <DnsOutlined sx={{ ml: -.75 }} />
                                        サーバーから探す
                                    </Fragment>
                                }
                            ]}
                        />
                    </Box>
                    {viewState === 'features' && <SectionContent>
                        <List>
                            <ListItemButton
                                component={NextLink}
                                href="/status"
                                sx={{
                                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                                }}
                            >
                                <ListItemIcon>
                                    <AnalyticsOutlined />
                                </ListItemIcon>
                                <ListItemText primary={translations.status} />
                            </ListItemButton>
                            <ListItemButton
                                component={NextLink}
                                href="/leaderboard"
                                sx={{
                                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                                }}
                            >
                                <ListItemIcon>
                                    <LeaderboardOutlined />
                                </ListItemIcon>
                                <ListItemText primary={translations.leaderboard} />
                            </ListItemButton>
                            <ListItemButton
                                component={NextLink}
                                href="/dashboard"
                                sx={{
                                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                                }}
                            >
                                <ListItemIcon>
                                    <SettingsOutlined />
                                </ListItemIcon>
                                <ListItemText primary={translations.guild_settings} />
                            </ListItemButton>
                        </List>
                    </SectionContent>}
                    {viewState === 'guilds' && <SectionContent>
                        {guilds ? (
                            <GuildsGalleryView
                                guilds={guilds.filter((guild) => guild.features.length > 0).map((guild) => guild.guild)}
                            />
                        ) : (
                            <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
                                <CircularProgress />
                            </Section>
                        )}
                    </SectionContent>}
                </Section>
            ) : (
                <Alert severity="info" sx={{ mt: 3 }}>
                    <AlertTitle>お知らせ</AlertTitle>
                    <Box sx={{ mb: .5 }}>
                        このサイトのすべての機能を利用するにはログインが必要です。<br />
                        下のボタンからログインをしてください。
                    </Box>
                    <Button
                        component={Link}
                        href={`https://accounts.lunaproject.jp/login${typeof window !== 'undefined' && window.location.href ? `?redirect=${encodeURIComponent(window.location.href)}` : ''}`}
                        disableElevation
                        variant="contained"
                        startIcon={<LoginOutlined />}
                        sx={{ px: 2 }}
                    >
                        {translations.login}
                    </Button>
                </Alert>
            )}
        </PageContent>
    );
};


export const UnauthorizedView = ({ localization: { translations } }: LocalizationProps) => (
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
            <PersonOffOutlined sx={{ fontSize: '10rem' }} color="primary" />
            <Typography variant="h4">ログインが必要です</Typography>
            <Typography align="center">
                このページにアクセスするにはログインが必要です。<br />
                下のボタンを押してログインをしてください。
            </Typography>
            <Button
                component={Link}
                href={`https://accounts.lunaproject.jp/login${typeof window !== 'undefined' && window.location.href ? `?redirect=${encodeURIComponent(window.location.href)}` : ''}`}
                variant="contained"
                size="large"
                startIcon={<LoginOutlined />}
            >
                {translations.login}
            </Button>
        </Box>
    </PageContent>
);

export const ForbiddenView = () => (
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
            <LockPersonOutlined sx={{ fontSize: '10rem' }} color="primary" />
            <Typography variant="h4">権限がありません</Typography>
            <Typography align="center">
                このページにアクセスするための権限がありません。<br />
                あなたに権限が付与されていることが確実な場合は、ほかのアカウントに切り替えて再度お試しください。
            </Typography>
        </Box>
    </PageContent>
);


export const NotFoundView = () => (
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
            <CloudOffOutlined sx={{ fontSize: '10rem' }} color="primary" />
            <Typography variant="h4">ページが見つかりません</Typography>
            <Typography align="center">
                指定されたページが見つかりませんでした。<br />
                ページのURLが変更されたか、ページそのものが削除された可能性があります。<br />
                お手数ですが、下のボタンからホームに戻ってください。
            </Typography>
            <Button
                href="/"
                variant="contained"
                size="large"
                startIcon={<HomeOutlined />}
            >
                ホームに戻る
            </Button>
        </Box>
    </PageContent>
);
