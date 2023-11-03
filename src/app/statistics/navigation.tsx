'use client';

import { NavigationAppBar, NavigationDrawerToolbar, NavigationProps } from '@app/_navigation';
import { DateTimeEditor } from '@components/date';
import {
    NavigationDrawer,
    NavigationDrawerContent,
    NavigationDrawerGroup,
    NavigationDrawerItem,
    NavigationRoot
} from '@components/navigation';
import { StatisticsPeriodType } from '@interfaces/bot';
import { TextChannelIcon } from '@lunaproject-discord/web-core/dist/components/Icons/channels';
import { RouteLink } from '@lunaproject-discord/web-core/dist/components/Link';
import { Select } from '@lunaproject-discord/web-core/dist/components/Select';
import {
    ArrowBackOutlined,
    DnsOutlined,
    EmojiEmotionsOutlined,
    HomeOutlined,
    PeopleAltOutlined,
    SellOutlined,
    WifiOutlined
} from '@mui/icons-material';
import { Box, FormControl, MenuItem, SelectChangeEvent, Theme, Typography, useMediaQuery } from '@mui/material';
import { getStateActionValue } from '@utils/state';
import { endOfToday } from 'date-fns';
import { DateTime } from 'luxon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, SetStateAction, useState } from 'react';

export const Navigation = ({ user, flags, localization }: NavigationProps) => {
    const { translations } = localization;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const [open, setOpen] = useState(false);

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

    const prefix = '/statistics';
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
                            <ArrowBackOutlined fontSize="small" />
                            {translations.back_to_home}
                        </RouteLink>
                    </Fragment> : <Typography variant="h5">{translations.statistics}</Typography>}
                    <Box sx={{ px: { xs: 1, md: 0 }, display: 'flex', flexDirection: 'column', gap: .5 }}>
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
                    <Box sx={{ px: { xs: 1, md: 0 }, display: 'flex', flexDirection: 'column', gap: .5 }}>
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
                    <NavigationDrawerContent>
                        <NavigationDrawerGroup>
                            <NavigationDrawerItem
                                href={`${prefix}${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                                predicate={(pathname) => pathname === prefix}
                                icon={<HomeOutlined />}
                                primary={translations.home}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/ping${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                                icon={<WifiOutlined />}
                                primary={translations.ping}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/guilds${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                                icon={<DnsOutlined />}
                                primary={translations.guilds}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/channels${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                                icon={<TextChannelIcon />}
                                primary={translations.channels}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/roles${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                                icon={<SellOutlined />}
                                primary={translations.roles}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/emojis${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                                icon={<EmojiEmotionsOutlined />}
                                primary={translations.emojis}
                                open={open}
                                setOpen={setOpen}
                            />
                            <NavigationDrawerItem
                                href={`${prefix}/users${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`}
                                icon={<PeopleAltOutlined />}
                                primary={translations.users}
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
