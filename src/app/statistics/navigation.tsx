'use client';

import { PopoverType } from '@app/_navigation';
import { MobileNavigationAppBarMenu } from '@app/_navigation/mobile';
import { UserPopover } from '@app/_popovers/user';
import { AppBar, Toolbar } from '@components/appbar';
import { DateTimeEditor } from '@components/date';
import { StatisticsPeriodType } from '@interfaces/bot';
import { UserViewProps } from '@interfaces/view';
import {
    DrawerButtonItemIconContainer,
    DrawerContainer,
    DrawerContent,
    DrawerRouteLinkBaseItem,
    DrawerRouteLinkItemProps,
    PermanentDrawer,
    StyledLi,
    StyledUl,
    TemporaryDrawer
} from '@lunaproject-discord/web-core/dist/components/Drawer';
import { TextChannelIcon } from '@lunaproject-discord/web-core/dist/components/Icons/channels';
import { RouteLink } from '@lunaproject-discord/web-core/dist/components/Link';
import { Select } from '@lunaproject-discord/web-core/dist/components/Select';
import {
    DnsOutlined,
    EmojiEmotionsOutlined,
    HomeOutlined,
    MenuOutlined,
    PeopleAltOutlined,
    SellOutlined,
    WifiOutlined
} from '@mui/icons-material';
import { Box, FormControl, IconButton, MenuItem, SelectChangeEvent, styled, Typography } from '@mui/material';
import { getStateActionValue } from '@utils/state';
import { endOfToday } from 'date-fns';
import { DateTime } from 'luxon';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Dispatch, Fragment, MouseEventHandler, SetStateAction, useState } from 'react';

interface HeaderProps extends UserViewProps {
    onDrawerToggleClick: MouseEventHandler;
}

const Header = ({ onDrawerToggleClick, user, localization }: HeaderProps) => {
    const [popoverState, setPopoverState] = useState<PopoverType>(undefined);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = popoverState !== undefined && Boolean(anchorEl);

    const openPopover = (elem: HTMLButtonElement, type: PopoverType) => {
        setPopoverState(type);
        setAnchorEl(elem);
    };

    const closePopover = () => {
        setPopoverState(undefined);
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <AppBar>
                <Toolbar>
                    <IconButton onClick={onDrawerToggleClick} color="inherit">
                        <MenuOutlined />
                    </IconButton>
                    <RouteLink href="/">
                        <Image src="/logo/yudzuki.svg" alt="" width={158} height={40} />
                    </RouteLink>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MobileNavigationAppBarMenu
                            openPopover={openPopover}
                            closePopover={closePopover}
                            user={user}
                            localization={localization}
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            <UserPopover
                open={popoverState === 'user' && open}
                anchorEl={anchorEl}
                onClose={closePopover}
                user={user}
                localization={localization}
            />
        </Fragment>
    );
};

const DrawerHeader = styled('header')(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

const HeaderButtonContainer = styled('li')(({ theme }) => ({
    padding: theme.spacing(0, 1, 1),
    display: 'block'
}));

interface DrawerProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const DrawerRouteLinkItem = (
    {
        label,
        icon,
        depth = 0,
        href,
        exact,
        onClick,
        ...props
    }: DrawerRouteLinkItemProps
) => {
    const pathname = usePathname();
    const loweredPathname = pathname?.toLowerCase();
    const loweredHref = new URL(href, window.location.href).pathname.toLowerCase();
    const isMatch = exact || href === '/' ? loweredPathname === loweredHref : (loweredPathname && loweredHref ? loweredPathname.startsWith(loweredHref) : false);

    return (
        <StyledLi depth={depth}>
            <DrawerRouteLinkBaseItem
                href={href}
                depth={depth}
                active={isMatch}
                onClick={onClick}
                {...props}
            >
                {icon && <DrawerButtonItemIconContainer>{icon}</DrawerButtonItemIconContainer>}
                {label}
            </DrawerRouteLinkBaseItem>
        </StyledLi>
    );
};

const DrawerItem = (
    {
        icon,
        label,
        href,
        exact,
        setOpen,
        depth = 1,
        ...props
    }: Omit<DrawerRouteLinkItemProps, 'onClick'> & DrawerProps
) => {
    const handleClick = () => setOpen(false);

    return (
        <DrawerRouteLinkItem
            icon={icon}
            label={label}
            href={href}
            exact={exact}
            onClick={handleClick}
            depth={depth}
            {...props}
        />
    );
};

const Drawer = ({ open, setOpen, localization: { translations } }: DrawerProps & UserViewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleDrawerClose = () => setOpen(false);

    const handlePeriodSelectChange = ({ target: { value } }: SelectChangeEvent<StatisticsPeriodType>) => {
        setOpen(false);

        const params = new URLSearchParams(searchParams.toString());
        params.set('period', value);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleStartedAtChange = (action: SetStateAction<Date | null>) => {
        const date = getStateActionValue(action, null);
        const start = date ? DateTime.fromJSDate(date).toSQL({ includeZone: false, includeOffset: false }) : undefined;

        const params = new URLSearchParams(searchParams.toString());
        if (date && start) {
            params.set('start', start);
        } else {
            params.delete('start');
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleEndedAtChange = (action: SetStateAction<Date | null>) => {
        const date = getStateActionValue(action, null);
        const end = date ? DateTime.fromJSDate(date).toSQL({ includeZone: false, includeOffset: false }) : undefined;

        const params = new URLSearchParams(searchParams.toString());
        if (date && end) {
            params.set('end', end);
        } else {
            params.delete('end');
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const drawer = (
        <Fragment>
            <DrawerHeader sx={{ p: { md: 1.5 } }}>
                <IconButton onClick={handleDrawerClose} sx={{ display: { md: 'none' } }}>
                    <MenuOutlined />
                </IconButton>
                <Typography variant="h5">{translations.statistics}</Typography>
            </DrawerHeader>
            <DrawerContent>
                <StyledUl container>
                    <HeaderButtonContainer sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ px: .5 }}>
                                {translations.statistics_mode}
                            </Typography>
                            <FormControl size="small" fullWidth>
                                <Select<StatisticsPeriodType>
                                    value={searchParams.get('period') as (StatisticsPeriodType | undefined) ?? 'hours'}
                                    onChange={handlePeriodSelectChange}
                                    label=""
                                >
                                    <MenuItem value="hours">{translations.statistics_mode_hours}</MenuItem>
                                    <MenuItem value="days">{translations.statistics_mode_days}</MenuItem>
                                    <MenuItem value="weeks">{translations.statistics_mode_weeks}</MenuItem>
                                    <MenuItem value="months">{translations.statistics_mode_months}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ px: .5 }}>
                                {translations.statistics_period}
                            </Typography>
                            <DateTimeEditor
                                value={searchParams.has('start') ? DateTime.fromSQL(searchParams.get('start')!!).toJSDate() : null}
                                setValue={handleStartedAtChange}
                                disableFuture
                                minDate={new Date(2023, 7, 1, 0, 0, 0)}
                                maxDate={endOfToday()}
                            />
                            <Box
                                sx={{
                                    px: .5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {translations.statistics_period_from}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {translations.statistics_period_to}
                                </Typography>
                            </Box>
                            <DateTimeEditor
                                value={searchParams.has('end') ? DateTime.fromSQL(searchParams.get('end')!!).toJSDate() : null}
                                setValue={handleEndedAtChange}
                                disableFuture
                                minDate={new Date(2023, 7, 1, 0, 0, 0)}
                                maxDate={endOfToday()}
                            />
                        </Box>
                    </HeaderButtonContainer>
                    <StyledUl sx={{ px: 1 }}>
                        <DrawerItem
                            icon={<HomeOutlined />}
                            label={translations.home}
                            href={`/statistics${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                            exact
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<WifiOutlined />}
                            label={translations.ping}
                            href={`/statistics/ping${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<DnsOutlined />}
                            label={translations.guilds}
                            href={`/statistics/guilds${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<TextChannelIcon />}
                            label={translations.channels}
                            href={`/statistics/channels${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<SellOutlined />}
                            label={translations.roles}
                            href={`/statistics/roles${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<EmojiEmotionsOutlined />}
                            label={translations.emojis}
                            href={`/statistics/emojis${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                            open={open}
                            setOpen={setOpen}
                        />
                        <DrawerItem
                            icon={<PeopleAltOutlined />}
                            label={translations.users}
                            href={`/statistics/users${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                            open={open}
                            setOpen={setOpen}
                        />
                    </StyledUl>
                </StyledUl>
            </DrawerContent>
        </Fragment>
    );

    return (
        <DrawerContainer>
            <TemporaryDrawer
                variant="temporary"
                open={open}
                onClose={handleDrawerClose}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </TemporaryDrawer>
            <PermanentDrawer variant="permanent">
                {drawer}
            </PermanentDrawer>
        </DrawerContainer>
    );
};

export const Navigation = ({ user, localization }: UserViewProps) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => setOpen((prevState) => !prevState);

    return (
        <Fragment>
            <Header onDrawerToggleClick={handleDrawerToggle} user={user} localization={localization} />
            <Drawer open={open} setOpen={setOpen} user={user} localization={localization} />
        </Fragment>
    );
};
