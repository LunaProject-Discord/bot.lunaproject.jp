'use client';

import { StyleProvider } from '@lunaproject-discord/web-core/dist/components/StyleProvider';
import { MuiPalette } from '@lunaproject-discord/web-core/dist/utils/theme';
import { OAuthUser } from '@lunaproject-discord/web-discord';
import {
    AnalyticsOutlined,
    ArrowBackOutlined,
    BrushOutlined,
    CheckOutlined,
    ChevronRightOutlined,
    HomeOutlined,
    LeaderboardOutlined,
    LoginOutlined,
    LogoutOutlined,
    NightlightRounded,
    SettingsOutlined,
    TranslateOutlined,
    TuneOutlined
} from '@mui/icons-material';
import {
    alpha,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    createTheme,
    CssBaseline,
    Divider,
    getOverlayAlpha,
    GlobalStyles,
    IconButton,
    List,
    ListItemButton as MuiListItemButton,
    ListItemButtonProps,
    ListItemIcon as MuiListItemIcon,
    ListItemText,
    ListSubheader,
    Paper,
    Popover,
    styled,
    ThemeProvider,
    Tooltip,
    Typography
} from '@mui/material';
import Link from 'next/link';
import { parseCookies, setCookie } from 'nookies';
import React, { Fragment, MouseEvent, ReactNode, useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { PageContainer } from '../components/layout';
import { LanguageType } from '../languages';
import { useLanguage, useTranslation } from '../languages/client';
import { COOKIE_APPEARANCE, COOKIE_LANGUAGE } from '../utils/cookie';
import { getUserAvatar } from '../utils/discord';
import { fetchWithUser } from '../utils/swr';
import { fontFamily } from './theme';

const NavigationBar = styled('nav')(({ theme }) => ({
    width: 56,
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `solid 1px ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));

const NavigationGroup = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
    padding: theme.spacing(.5, 1.5),
    gap: theme.spacing(1.5)
}));


interface ListItemSwitchProps extends ListItemButtonProps {
    checked: boolean;
    primary: ReactNode;
    secondary?: ReactNode;
}

const ListItemSwitch = ({ checked, primary, secondary, ...props }: ListItemSwitchProps) => (
    <ListItemButton dense {...props}>
        <ListItemIcon>
            {checked && <CheckOutlined />}
        </ListItemIcon>
        <ListItemText primary={primary} secondary={secondary} />
    </ListItemButton>
);

const ListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({
    minWidth: theme.spacing(3)
}));

type AppearanceType = 'system' | 'light' | 'dark';

export const Layout = ({ children }: { children: ReactNode }) => {
    const [appearance, setAppearance] = useState<AppearanceType>('system');
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            ...MuiPalette,
            mode: darkMode ? 'dark' : 'light'
        },
        typography: {
            fontFamily: fontFamily
        }
    });

    const translations = useTranslation();
    const language = useLanguage();

    const cookies = parseCookies();
    const token = cookies['token'];

    const { data, error } = useSWRImmutable<OAuthUser>(
        token ? ['https://discord.com/api/v10/users/@me', token] : null,
        ([url, token]) => fetchWithUser(url, token)
    );

    useEffect(() => {
        const appearance = cookies[COOKIE_APPEARANCE] as AppearanceType | undefined ?? 'system';
        setAppearance(appearance);
        setDarkMode(appearance === 'dark' || appearance === 'system' && window.matchMedia('@media (prefers-color-scheme: dark)').matches);
    }, []);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const [panelState, setPanelState] = useState<'appearance' | 'language' | null>(null);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        setPanelState(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeAppearance = (type: AppearanceType) => {
        const isBrowserDarkScheme = window.matchMedia('@media (prefers-color-scheme: dark)').matches;
        setAppearance(type);
        setDarkMode(type === 'dark' || (type === 'system' && isBrowserDarkScheme));
        setCookie(
            null,
            COOKIE_APPEARANCE,
            type,
            {
                domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string,
                path: '/'
            }
        );

        setAnchorEl(null);
    };

    const handleChangeLanguage = (type: LanguageType) => {
        setCookie(
            null,
            COOKIE_LANGUAGE,
            type,
            {
                domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string,
                path: '/'
            }
        );
        setAnchorEl(null);
        window.location.reload();
    };

    return (
        <StyleProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles styles={{ '*, ::before, ::after': { fontFamily: fontFamily } }} />
                <NavigationBar>
                    <NavigationGroup>
                        <IconButton disabled>
                            <NightlightRounded sx={{ color: '#ffc636' }} />
                        </IconButton>
                    </NavigationGroup>
                    <Divider flexItem sx={{ mx: 1 }} />
                    <NavigationGroup sx={{ height: '100%' }}>
                        <Tooltip title={translations.home} placement="right">
                            <IconButton component={Link} href="/">
                                <HomeOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.status} placement="right">
                            <IconButton component={Link} href="/status">
                                <AnalyticsOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.leaderboard} placement="right">
                            <IconButton component={Link} href="/leaderboard">
                                <LeaderboardOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.server_settings} placement="right">
                            <IconButton component={Link} href="/guilds">
                                <SettingsOutlined />
                            </IconButton>
                        </Tooltip>
                    </NavigationGroup>
                    <Divider flexItem sx={{ mx: 1 }} />
                    <NavigationGroup>
                        {!data ? <Fragment>
                            <Tooltip title={translations.site_settings} placement="right">
                                <IconButton onClick={handleClick}>
                                    <TuneOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={translations.login} placement="right">
                                <IconButton component={Link} href="https://accounts.lunaproject.jp/login">
                                    <LoginOutlined />
                                </IconButton>
                            </Tooltip>
                        </Fragment> : <Tooltip title={data.username} placement="right">
                            <IconButton sx={{ p: .5 }} onClick={handleClick}>
                                <Avatar
                                    src={getUserAvatar(data)}
                                    sx={{ width: 32, height: 32, pointerEvents: 'none' }}
                                />
                            </IconButton>
                        </Tooltip>}
                    </NavigationGroup>
                </NavigationBar>
                <PageContainer>
                    {children}
                </PageContainer>
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: { xs: 'block', md: 'none' }
                    }}
                >
                    <BottomNavigation>
                        <BottomNavigationAction icon={<HomeOutlined />} component={Link} href="/" />
                        <BottomNavigationAction icon={<AnalyticsOutlined />} component={Link} href="/status" />
                        <BottomNavigationAction
                            icon={<LeaderboardOutlined />}
                            component={Link}
                            href="/leaderboard"
                        />
                        <BottomNavigationAction icon={<SettingsOutlined />} component={Link} href="/guilds" />
                    </BottomNavigation>
                </Paper>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    PaperProps={{
                        sx: {
                            width: 300,
                            left: '8px !important',
                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                            boxShadow: (theme) => `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
                        }
                    }}
                >
                    {panelState === 'appearance' && <Fragment>
                        <List>
                            <ListItemButton dense onClick={() => setPanelState(null)}>
                                <ListItemIcon sx={{ minWidth: 'unset' }}>
                                    <ArrowBackOutlined />
                                </ListItemIcon>
                                <ListItemText primary={translations.design_and_appearance} />
                            </ListItemButton>
                        </List>
                        <Divider />
                        <List>
                            <ListItemSwitch
                                checked={appearance === 'system'}
                                primary={translations.device_theme}
                                onClick={() => handleChangeAppearance('system')}
                            />
                            <ListItemSwitch
                                checked={appearance === 'light'}
                                primary={translations.light_theme}
                                onClick={() => handleChangeAppearance('light')}
                            />
                            <ListItemSwitch
                                checked={appearance === 'dark'}
                                primary={translations.dark_theme}
                                onClick={() => handleChangeAppearance('dark')}
                            />
                        </List>
                    </Fragment>}
                    {panelState === 'language' && <Fragment>
                        <List>
                            <ListItemButton dense onClick={() => setPanelState(null)}>
                                <ListItemIcon sx={{ minWidth: 'unset' }}>
                                    <ArrowBackOutlined />
                                </ListItemIcon>
                                <ListItemText primary={translations.language} />
                            </ListItemButton>
                        </List>
                        <Divider />
                        <List>
                            <ListItemSwitch
                                checked={language === 'ja'}
                                primary={translations.japanese}
                                onClick={() => handleChangeLanguage('ja')}
                            />
                            <ListItemSwitch
                                checked={language === 'en'}
                                primary={translations.english}
                                onClick={() => handleChangeLanguage('en')}
                            />
                        </List>
                    </Fragment>}
                    {panelState === null && <Fragment>
                        {data && <Fragment>
                            <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
                                <Avatar
                                    src={`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}`}
                                    sx={{ pointerEvents: 'none' }}
                                />
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="h6" sx={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
                                        {data.username}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'Renner', lineHeight: 1.1 }}>
                                        #{data.discriminator}
                                    </Typography>
                                </Box>
                                <Tooltip title={translations.logout}>
                                    <IconButton component={Link} href="https://accounts.lunaproject.jp/logout">
                                        <LogoutOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Divider />
                        </Fragment>}
                        <List subheader={data ? (
                            <ListSubheader
                                component="div"
                                sx={{
                                    pt: 1,
                                    pb: .5,
                                    px: 1.5,
                                    lineHeight: 'unset',
                                    userSelect: 'none',
                                    backgroundImage: (theme) => theme.palette.mode === 'dark' ? `linear-gradient(${alpha(
                                        '#fff',
                                        Number(getOverlayAlpha(8))
                                    )}, ${alpha(
                                        '#fff',
                                        Number(getOverlayAlpha(8))
                                    )})` : 'none'
                                }}
                            >
                                {translations.site_settings}
                            </ListSubheader>
                        ) : undefined}>
                            <ListItemButton dense onClick={() => setPanelState('appearance')}>
                                <ListItemIcon>
                                    <BrushOutlined />
                                </ListItemIcon>
                                <ListItemText primary={translations.design_and_appearance} />
                                <ChevronRightOutlined color="action" />
                            </ListItemButton>
                            <ListItemButton dense onClick={() => setPanelState('language')}>
                                <ListItemIcon>
                                    <TranslateOutlined />
                                </ListItemIcon>
                                <ListItemText primary={translations.language} />
                                <ChevronRightOutlined color="action" />
                            </ListItemButton>
                        </List>
                    </Fragment>}
                </Popover>
            </ThemeProvider>
        </StyleProvider>
    );
};
