import {
    PopoverListItemButton,
    PopoverListItemIcon,
    PopoverListItemLinkButton,
    PopoverListItemSwitch,
    UserPopoverProps,
    userPopoverStateAtom
} from '@/app/_popovers';
import {
    ArrowBackIcon,
    BrushIcon,
    KeyboardArrowRightIcon,
    LogoutIcon,
    ManageAccountsIcon,
    OpenInNewIcon,
    SettingsIcon,
    TranslateIcon
} from '@/components/icons';
import { LocaleType } from '@/interfaces/localization';
import { appearanceAtom, AppearanceType } from '@/states/appearance';
import { COOKIE_APPEARANCE, COOKIE_LOCALE } from '@/utils/cookie';
import { getUserAvatar, getUserDisplayName } from '@/utils/discord';
import { BottomSheet, BottomSheetContent } from '@lunaproject/web-core/dist/components/BottomSheet';
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    listItemButtonClasses,
    ListItemText,
    ListSubheader,
    Tooltip,
    Typography
} from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import NextLink from 'next/link';
import { setCookie } from 'nookies';
import React, { Fragment, useRef } from 'react';
import { BottomSheetRef } from 'react-spring-bottom-sheet';

const AppearancePopoverContent = ({ localization: { translations } }: UserPopoverProps) => {
    const setPopoverState = useSetAtom(userPopoverStateAtom);

    const [{ appearance }, setAppearance] = useAtom(appearanceAtom);

    const handleAppearanceChange = (type: AppearanceType) => {
        const isBrowserDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
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

        setPopoverState(undefined);
    };

    return (
        <Fragment>
            <List>
                <PopoverListItemButton onClick={() => setPopoverState({ state: undefined })}>
                    <PopoverListItemIcon sx={{ minWidth: 'unset' }}>
                        <ArrowBackIcon />
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

const LocalePopoverContent = ({ localization: { locale, translations } }: UserPopoverProps) => {
    const setPopoverState = useSetAtom(userPopoverStateAtom);

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

        setPopoverState(undefined);

        window.location.reload();
    };

    return (
        <Fragment>
            <List>
                <PopoverListItemButton onClick={() => setPopoverState({ state: undefined })}>
                    <PopoverListItemIcon sx={{ minWidth: 'unset' }}>
                        <ArrowBackIcon />
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

export const MobileUserPopover = ({ user, localization }: UserPopoverProps) => {
    const { translations } = localization;

    const sheetRef = useRef<BottomSheetRef | null>(null);

    const [popoverState, setPopoverState] = useAtom(userPopoverStateAtom);
    const contentState = popoverState?.state;

    return (
        <BottomSheet
            ref={sheetRef}
            open={popoverState !== undefined}
            onDismiss={() => setPopoverState(undefined)}
            expandOnContentDrag
        >
            <BottomSheetContent
                sx={{
                    p: 0,
                    gap: 0,
                    [`& .${listItemButtonClasses.root}`]: {
                        px: 2,
                        py: 1,
                        gap: 2
                    }
                }}
            >
                {contentState === 'appearance' && <AppearancePopoverContent user={user} localization={localization} />}
                {contentState === 'locale' && <LocalePopoverContent user={user} localization={localization} />}
                {!contentState && <Fragment>
                    {user && <Fragment>
                        <Box sx={{ p: 2, pt: 1, display: 'flex', gap: 2 }}>
                            <Avatar
                                src={getUserAvatar(user)}
                                alt=" "
                                sx={{
                                    width: (theme) => theme.spacing(8),
                                    height: (theme) => theme.spacing(8),
                                    pointerEvents: 'none'
                                }}
                            />
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={500}
                                    whiteSpace="nowrap"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                >
                                    {getUserDisplayName(user)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontFamily="Renner">
                                    {user.global_name ? `@${user.username}` : `#${user.discriminator}`}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}>
                                <Tooltip title={translations.user_settings}>
                                    <IconButton
                                        component={NextLink}
                                        href="/dashboard/me"
                                        onClick={() => setPopoverState(undefined)}
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={translations.logout}>
                                    <IconButton component={NextLink} href="https://account.lunaproject.jp/logout">
                                        <LogoutIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        <Divider />
                        <List>
                            <PopoverListItemLinkButton href="https://account.lunaproject.jp/">
                                <PopoverListItemIcon>
                                    <ManageAccountsIcon />
                                </PopoverListItemIcon>
                                <ListItemText primary={translations.manage_account} />
                                <OpenInNewIcon color="action" />
                            </PopoverListItemLinkButton>
                        </List>
                        <Divider />
                    </Fragment>}
                    <List subheader={user ? (
                        <ListSubheader
                            component="div"
                            sx={(theme) => ({
                                pt: 1.5,
                                pb: .5,
                                px: 2,
                                lineHeight: 'unset',
                                backgroundImage: 'none',
                                ...theme.applyStyles('dark', {
                                    backgroundImage: theme.vars.overlays[8]
                                })
                            })}
                        >
                            {translations.site_settings}
                        </ListSubheader>
                    ) : undefined}>
                        <PopoverListItemButton onClick={() => setPopoverState({ state: 'appearance' })}>
                            <PopoverListItemIcon>
                                <BrushIcon />
                            </PopoverListItemIcon>
                            <ListItemText primary={translations.design_and_appearance} />
                            <KeyboardArrowRightIcon color="action" />
                        </PopoverListItemButton>
                        <PopoverListItemButton onClick={() => setPopoverState({ state: 'locale' })}>
                            <PopoverListItemIcon>
                                <TranslateIcon />
                            </PopoverListItemIcon>
                            <ListItemText primary={translations.language} />
                            <KeyboardArrowRightIcon color="action" />
                        </PopoverListItemButton>
                    </List>
                </Fragment>}
            </BottomSheetContent>
        </BottomSheet>
    );
};
