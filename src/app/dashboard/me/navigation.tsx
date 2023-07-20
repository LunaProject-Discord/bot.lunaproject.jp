'use client';

import { PopoverType } from '@app/_navigation';
import { MobileNavigationAppBarMenu } from '@app/_navigation/mobile';
import { UserPopover } from '@app/_popovers/user';
import { AppBar, Toolbar } from '@components/appbar';
import { UserViewProps } from '@interfaces/view';
import {
    DrawerContainer,
    DrawerContent,
    DrawerGroup,
    DrawerRouteLinkItem,
    DrawerRouteLinkItemProps,
    PermanentDrawer,
    StyledUl,
    TemporaryDrawer
} from '@lunaproject-discord/web-core/dist/components/Drawer';
import { RouteLink } from '@lunaproject-discord/web-core/dist/components/Link';
import { HomeOutlined, MenuOutlined, NotificationsOutlined, ScheduleOutlined } from '@mui/icons-material';
import { Box, IconButton, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

const DrawerHeader = styled('li')(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

interface DrawerProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

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

const Drawer = (
    {
        open,
        setOpen,
        localization: { translations }
    }: DrawerProps & UserViewProps
) => {
    const router = useRouter();

    const handleDrawerClose = () => setOpen(false);

    const drawer = (
        <DrawerContent>
            <StyledUl container>
                <DrawerHeader sx={{ p: { md: 1.5 } }}>
                    <IconButton onClick={handleDrawerClose} sx={{ display: { md: 'none' } }}>
                        <MenuOutlined />
                    </IconButton>
                    <Typography variant="h5">{translations.user_settings}</Typography>
                </DrawerHeader>
                <StyledUl sx={{ px: 1 }}>
                    <DrawerItem
                        icon={<HomeOutlined />}
                        label={translations.home}
                        href="/dashboard/me"
                        exact
                        open={open}
                        setOpen={setOpen}
                    />
                    <DrawerItem
                        icon={<NotificationsOutlined />}
                        label={translations.notifications}
                        href="/dashboard/me/notifications"
                        open={open}
                        setOpen={setOpen}
                    />
                </StyledUl>
                <DrawerGroup label={translations.settings_basic}>
                    <DrawerItem
                        icon={<ScheduleOutlined />}
                        label={translations.time_and_language}
                        href="/dashboard/me/time-and-language"
                        open={open}
                        setOpen={setOpen}
                    />
                </DrawerGroup>
            </StyledUl>
        </DrawerContent>
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

    const handleDrawerToggle = () => setOpen((prevOpen) => !prevOpen);

    return (
        <Fragment>
            <Header onDrawerToggleClick={handleDrawerToggle} user={user} localization={localization} />
            <Drawer open={open} setOpen={setOpen} user={user} localization={localization} />
        </Fragment>
    );
};
