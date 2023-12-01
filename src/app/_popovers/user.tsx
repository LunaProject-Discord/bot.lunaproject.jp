'use client';

import { LocaleType, LocalizationProps } from '@interfaces/localization';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces/discord';
import {
    ArrowBackOutlined,
    BrushOutlined,
    ChevronRightOutlined,
    LogoutOutlined,
    ManageAccountsOutlined,
    OpenInNewOutlined,
    SettingsOutlined,
    TranslateOutlined
} from '@mui/icons-material';
import {
    alpha,
    Avatar,
    Box,
    Divider,
    getOverlayAlpha,
    IconButton,
    List,
    ListItemText,
    ListSubheader,
    Popover,
    Tooltip,
    Typography
} from '@mui/material';
import { appearanceAtom, AppearanceType } from '@states/appearance';
import { popoverAtom } from '@states/popover';
import { COOKIE_APPEARANCE, COOKIE_LOCALE } from '@utils/cookie';
import { getUserAvatar, getUserDisplayName } from '@utils/discord';
import NextLink from 'next/link';
import { setCookie } from 'nookies';
import React, { Fragment, useState } from 'react';
import { useRecoilState } from 'recoil';
import { PopoverListItemButton, PopoverListItemIcon, PopoverListItemLinkButton, PopoverListItemSwitch } from './index';

interface PanelContentProps extends LocalizationProps {
    onClose: () => void;
    setPanelState: (panel: PanelType) => void;
}

const AppearancePanelContent = ({ onClose, setPanelState, localization: { translations } }: PanelContentProps) => {
    const [{ appearance }, setAppearance] = useRecoilState(appearanceAtom);

    const handleAppearanceChange = (type: AppearanceType) => {
        const isBrowserDarkScheme = window.matchMedia('@media (prefers-color-scheme: dark)').matches;
        setAppearance({
            appearance: type,
            isDarkMode: type === 'dark' || (type === 'system' && isBrowserDarkScheme)
        });

        setCookie(
            null,
            COOKIE_APPEARANCE,
            type,
            {
                domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string,
                path: '/'
            }
        );

        onClose();
    };

    return (
        <Fragment>
            <List>
                <PopoverListItemButton dense onClick={() => setPanelState(null)}>
                    <PopoverListItemIcon sx={{ minWidth: 'unset' }}>
                        <ArrowBackOutlined />
                    </PopoverListItemIcon>
                    <ListItemText primary={translations.design_and_appearance} />
                </PopoverListItemButton>
            </List>
            <Divider />
            <List>
                <PopoverListItemSwitch
                    checked={appearance === 'system'}
                    primary={translations.device_theme}
                    onClick={() => handleAppearanceChange('system')}
                />
                <PopoverListItemSwitch
                    checked={appearance === 'light'}
                    primary={translations.light_theme}
                    onClick={() => handleAppearanceChange('light')}
                />
                <PopoverListItemSwitch
                    checked={appearance === 'dark'}
                    primary={translations.dark_theme}
                    onClick={() => handleAppearanceChange('dark')}
                />
            </List>
        </Fragment>
    );
};

const LocalePanelContent = ({ onClose, setPanelState, localization: { locale, translations } }: PanelContentProps) => {
    const handleLocaleChange = (type: LocaleType) => {
        setCookie(
            null,
            COOKIE_LOCALE,
            type,
            {
                domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string,
                path: '/'
            }
        );

        onClose();

        window.location.reload();
    };

    return (
        <Fragment>
            <List>
                <PopoverListItemButton dense onClick={() => setPanelState(null)}>
                    <PopoverListItemIcon sx={{ minWidth: 'unset' }}>
                        <ArrowBackOutlined />
                    </PopoverListItemIcon>
                    <ListItemText primary={translations.language} />
                </PopoverListItemButton>
            </List>
            <Divider />
            <List>
                <PopoverListItemSwitch
                    checked={locale === 'ja'}
                    primary={translations.japanese}
                    onClick={() => handleLocaleChange('ja')}
                />
                <PopoverListItemSwitch
                    checked={locale === 'en'}
                    primary={translations.english}
                    onClick={() => handleLocaleChange('en')}
                />
            </List>
        </Fragment>
    );
};

type PanelType = 'appearance' | 'locale' | null;

export interface UserPopoverProps extends LocalizationProps {
    user: OAuthUser | undefined;
}

export const UserPopover = ({ user, localization }: UserPopoverProps) => {
    const { translations } = localization;

    const [popoverState, setPopoverState] = useRecoilState(popoverAtom);
    const [panelState, setPanelState] = useState<PanelType>(null);

    const handleClose = () => {
        setPanelState(null);
        setPopoverState(undefined);
    };

    return (
        <Popover
            open={popoverState?.type === 'user'}
            anchorEl={popoverState?.anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 300,
                        border: (theme) => `solid 1px ${theme.palette.divider}`,
                        boxShadow: (theme) => `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
                    }
                }
            }}
        >
            {panelState === 'appearance' && <AppearancePanelContent
                onClose={handleClose}
                setPanelState={setPanelState}
                localization={localization}
            />}
            {panelState === 'locale' && <LocalePanelContent
                onClose={handleClose}
                setPanelState={setPanelState}
                localization={localization}
            />}
            {panelState === null && <Fragment>
                {user && <Fragment>
                    <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
                        <Avatar
                            src={getUserAvatar(user)}
                            alt=" "
                            sx={{ pointerEvents: 'none' }}
                        />
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="h6" sx={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
                                {getUserDisplayName(user)}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontFamily: 'Renner', lineHeight: 1.1 }}
                            >
                                {user.global_name ? `@${user.username}` : `#${user.discriminator}`}
                            </Typography>
                        </Box>
                        <Tooltip title={translations.user_settings} placement="top">
                            <IconButton component={NextLink} href="/dashboard/me">
                                <SettingsOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translations.logout} placement="top">
                            <IconButton component={NextLink} href="https://account.lunaproject.jp/logout">
                                <LogoutOutlined />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider />
                    <List>
                        <PopoverListItemLinkButton href="https://account.lunaproject.jp/" dense>
                            <PopoverListItemIcon>
                                <ManageAccountsOutlined />
                            </PopoverListItemIcon>
                            <ListItemText primary={translations.manage_account} />
                            <OpenInNewOutlined color="action" />
                        </PopoverListItemLinkButton>
                    </List>
                    <Divider />
                </Fragment>}
                <List subheader={user ? (
                    <ListSubheader
                        component="div"
                        sx={{
                            pt: 1,
                            pb: .5,
                            px: 1.5,
                            lineHeight: 'unset',
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
                    <PopoverListItemButton dense onClick={() => setPanelState('appearance')}>
                        <PopoverListItemIcon>
                            <BrushOutlined />
                        </PopoverListItemIcon>
                        <ListItemText primary={translations.design_and_appearance} />
                        <ChevronRightOutlined color="action" />
                    </PopoverListItemButton>
                    <PopoverListItemButton dense onClick={() => setPanelState('locale')}>
                        <PopoverListItemIcon>
                            <TranslateOutlined />
                        </PopoverListItemIcon>
                        <ListItemText primary={translations.language} />
                        <ChevronRightOutlined color="action" />
                    </PopoverListItemButton>
                </List>
            </Fragment>}
        </Popover>
    );
};
