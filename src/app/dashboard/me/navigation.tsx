'use client';

import { NavigationAppBar, NavigationDrawerToolbar, NavigationProps } from '@/app/_navigation';
import { ArrowBackIcon, HomeIcon, NotificationsIcon, ScheduleIcon } from '@/components/icons';
import {
    NavigationDrawer,
    NavigationDrawerContent,
    NavigationDrawerGroup,
    NavigationDrawerItem,
    NavigationRoot
} from '@/components/navigation';
import { RouteLink } from '@lunaproject/web-core/dist/components/Link';
import { Box, Theme, Typography, useMediaQuery } from '@mui/material';
import React, { Fragment, useState } from 'react';

export const Navigation = ({ user, flags, localization }: NavigationProps) => {
    const { translations } = localization;

    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const [open, setOpen] = useState(false);

    const prefix = '/dashboard/me';
    return (
        <Fragment>
            {!isDesktop && <NavigationAppBar
                open={open}
                setOpen={setOpen}
                user={user}
                flags={flags}
                localization={localization}
            />}
            <NavigationRoot>
                <NavigationDrawer
                    open={open}
                    onClose={() => setOpen(false)}
                    variant={isDesktop ? 'permanent' : 'temporary'}
                >
                    {!isDesktop ? <Fragment>
                        <NavigationDrawerToolbar open={open} setOpen={setOpen} />
                        <RouteLink
                            href="/"
                            underline="none"
                            color="text.secondary"
                            sx={{
                                mx: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <ArrowBackIcon fontSize="small" />
                            {translations.back_to_home}
                        </RouteLink>
                    </Fragment> : <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5">{translations.dashboard}</Typography>
                        <Typography color="text.secondary">{translations.user_settings}</Typography>
                    </Box>}
                    <NavigationDrawerContent>
                        <NavigationDrawerGroup>
                            <NavigationDrawerItem
                                href={prefix}
                                predicate={(pathname) => pathname === prefix}
                                icon={<HomeIcon />}
                                primary={translations.home}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/notifications`}
                                icon={<NotificationsIcon />}
                                primary={translations.notifications}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                        <NavigationDrawerGroup label={translations.settings_basic}>
                            <NavigationDrawerItem
                                href={`${prefix}/time-and-language`}
                                icon={<ScheduleIcon />}
                                primary={translations.time_and_language}
                                open={open}
                                setOpen={setOpen}
                            />
                        </NavigationDrawerGroup>
                    </NavigationDrawerContent>
                </NavigationDrawer>
            </NavigationRoot>
        </Fragment>
    );
};
