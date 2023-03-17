'use client';

import {
    Gallery,
    GalleryItem,
    GalleryItemIcon,
    GalleryItemText
} from '@lunaproject-discord/web-core/dist/components/Gallery';
import { OAuthGuild, OAuthUser } from '@lunaproject-discord/web-discord';
import {
    AnalyticsOutlined,
    AutoAwesomeOutlined,
    DnsOutlined,
    LeaderboardOutlined,
    LockPersonOutlined,
    LoginOutlined,
    PersonOffOutlined,
    SettingsOutlined
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel as MuiTabPanel } from '@mui/lab';
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
    styled,
    Tab as MuiTab,
    TabProps,
    Typography
} from '@mui/material';
import Link from 'next/link';
import NextLink from 'next/link';
import { parseCookies } from 'nookies';
import React, { SyntheticEvent, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { PageContent } from '../components/layout';
import { Section } from '../components/section';
import { FeaturedGuild } from '../interfaces/bot';
import { TranslatableViewProps } from '../interfaces/view';
import { getGuildIcon } from '../utils/discord';
import { fetchWithUser } from '../utils/swr';

const Tab = styled(
    (props) => <MuiTab iconPosition="start" {...props} />
)<TabProps>(({ theme }) => ({
    minHeight: theme.spacing(6)
}));

const TabPanel = styled(MuiTabPanel)(({ theme }) => ({
    height: '100%',
    padding: theme.spacing(1, 0)
}));

interface GuildListProps {
    guilds: OAuthGuild[];
}

const GuildListGalleryView = ({ guilds }: GuildListProps) => (
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

const GuildListTableView = ({ guilds }: GuildListProps) => (
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

type TabState = 'features' | 'guilds';

interface Props extends TranslatableViewProps {
    user: OAuthUser | undefined;
}

export const View = ({ user, translations }: Props) => {
    const cookies = parseCookies();
    const token = cookies['token'];

    const { data: guilds } = useSWRImmutable<FeaturedGuild[]>(
        token ? ['/api/users/@me/__home/guilds', token] : null,
        ([url, token]: string[]) => fetchWithUser(url, token)
    );

    const [tabState, setTabState] = useState<TabState>('guilds');

    const handleTabChange = (e: SyntheticEvent, newValue: TabState) => setTabState(newValue);

    return (
        <PageContent>
            <Typography variant="h4">ようこそ</Typography>
            <Alert severity="warning" sx={{ my: 1 }}>
                <AlertTitle>警告</AlertTitle>
                このサイトは現在開発中です。大部分は利用できません。
            </Alert>
            {user ? (
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabState}>
                        <Box sx={{ borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}>
                            <TabList onChange={handleTabChange}>
                                <Tab
                                    value="features"
                                    icon={<AutoAwesomeOutlined />}
                                    iconPosition="start"
                                    label="機能から探す"
                                />
                                <Tab
                                    value="guilds"
                                    icon={<DnsOutlined />}
                                    iconPosition="start"
                                    label="サーバーから探す"
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="features">
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
                                    <ListItemText primary={translations.server_settings} />
                                </ListItemButton>
                            </List>
                        </TabPanel>
                        <TabPanel value="guilds" sx={{ py: 2 }}>
                            {guilds ? (
                                <GuildListGalleryView
                                    guilds={guilds.filter((guild) => guild.features.length > 0).map((guild) => guild.guild)}
                                />
                            ) : (
                                <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
                                    <CircularProgress />
                                </Section>
                            )}
                        </TabPanel>
                    </TabContext>
                </Box>
            ) : (
                <Alert severity="info" sx={{ my: 1 }}>
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


export const UnauthorizedView = ({ translations }: TranslatableViewProps) => (
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
