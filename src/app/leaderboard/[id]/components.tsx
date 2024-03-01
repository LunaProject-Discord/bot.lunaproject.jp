'use client';

import { getMemberDisplay, getUserDisplay } from '@/app/user';
import { ItemFormContainer, ItemIcon, ItemRoot, ItemRowContainer, ItemTextBlock } from '@/components/items';
import { Code } from '@/components/text';
import { GuildLevel } from '@/interfaces/bot';
import { DataGuild, RedisGuild } from '@/interfaces/redis';
import { GuildViewProps } from '@/interfaces/view';
import { buildCdnUrl, getMemberAvatar, getUserAvatar } from '@/utils/cdn';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { Avatar, Box, BoxProps, CircularProgress, styled, Typography } from '@mui/material';
import clsx from 'clsx';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { WindowVirtualizer, WindowVirtualizerProps } from 'virtua';

export const levelItemClasses = {
    root: 'LevelItem-root',
    mobileRoot: 'LevelItem-mobileRoot',
    desktopRoot: 'LevelItem-desktopRoot'
};

export const LevelItemRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(levelItemClasses.root, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    marginTop: theme.spacing(1)
}));

export const MobileLevelItemRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <ItemRoot
            className={clsx(levelItemClasses.mobileRoot, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    padding: 0,
    [theme.breakpoints.up('md')]: {
        display: 'none'
    }
}));

export const DesktopLevelItemRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(levelItemClasses.desktopRoot, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(0, 1.5),
    display: 'grid',
    gridTemplateColumns: '32px 40px 1fr 10% 10%',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));

export const LevelItemRankRoot = styled(Box)(({ theme }) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'flex',
    flexShrink: 0,
    placeItems: 'center',
    placeContent: 'center',
    fontFamily: 'Renner, sans-serif',
    color: theme.palette.common.white,
    borderRadius: '50%'
}));

export const LevelItemGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

export interface LevelItemProfileProps {
    guild: RedisGuild | DataGuild;
    user: GuildLevel['user'];
    member: GuildLevel['member'];
}

export const LevelItemProfile = ({ guild, user, member }: LevelItemProfileProps) => {
    if (member) {
        const [primary, secondary] = getMemberDisplay(member);

        return (
            <Fragment>
                <ItemIcon
                    icon={
                        <Avatar
                            src={getMemberAvatar(member, guild)}
                            alt=" "
                            sx={{ pointerEvents: 'none' }}
                        />
                    }
                />
                <ItemTextBlock primary={primary} secondary={secondary} />
            </Fragment>
        );
    } else if ('name' in user) {
        const [primary, secondary] = getUserDisplay(user);

        return (
            <Fragment>
                <ItemIcon
                    icon={
                        <Avatar
                            src={getUserAvatar(user)}
                            alt=" "
                            sx={{ pointerEvents: 'none' }}
                        />
                    }
                />
                <ItemTextBlock primary={primary} secondary={secondary} />
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <ItemIcon
                    icon={
                        <Avatar
                            src={buildCdnUrl('/embed/avatars/0', undefined, 'png')}
                            alt=" "
                            sx={{ pointerEvents: 'none' }}
                        />
                    }
                />
                <ItemTextBlock primary={<Code>{user.id}</Code>} />
            </Fragment>
        );
    }
};

export interface LevelItemRankProps {
    rank: number;
}

export const LevelItemRank = ({ rank }: LevelItemRankProps) => {
    if (rank === 1) {
        return (<LevelItemRankRoot sx={{ bgcolor: '#ffc006', fontSize: '1.25rem' }}>{rank}</LevelItemRankRoot>);
    } else if (rank === 2) {
        return (<LevelItemRankRoot sx={{ bgcolor: '#7fbfe2', fontSize: '1.25rem' }}>{rank}</LevelItemRankRoot>);
    } else if (rank === 3) {
        return (<LevelItemRankRoot sx={{ bgcolor: '#d18d52', fontSize: '1.25rem' }}>{rank}</LevelItemRankRoot>);
    } else if (rank <= 10) {
        return (<LevelItemRankRoot sx={{ bgcolor: 'primary.main' }}>{rank}</LevelItemRankRoot>);
    } else {
        return (
            <LevelItemRankRoot
                sx={{
                    color: 'primary.main',
                    bgcolor: 'transparent',
                    border: (theme) => `solid 1px ${theme.palette.primary.main}`
                }}
            >
                {rank}
            </LevelItemRankRoot>
        );
    }
};

export const MobileLevelItem = (
    {
        guild,
        level: {
            user,
            member,
            rank,
            level,
            experience
        },
        localization: { translations }
    }: LevelItemProps
) => (
    <MobileLevelItemRoot>
        <ItemRowContainer>
            <LevelItemRank rank={rank} />
            <LevelItemProfile guild={guild} user={user} member={member} />
        </ItemRowContainer>
        <ItemFormContainer sx={{ justifyContent: 'flex-start' }}>
            <LevelItemGroup sx={{ minWidth: '35%' }}>
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {translations.level}
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: 'Renner' }}>{level}</Typography>
            </LevelItemGroup>
            <LevelItemGroup>
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {translations.experience}
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: 'Renner' }}>{experience}</Typography>
            </LevelItemGroup>
        </ItemFormContainer>
    </MobileLevelItemRoot>
);

export const DesktopLevelItem = (
    {
        guild,
        level: {
            user,
            member,
            rank,
            level,
            experience
        },
        localization: { translations }
    }: LevelItemProps
) => (
    <DesktopLevelItemRoot sx={{ height: 50 }}>
        <LevelItemRank rank={rank} />
        <LevelItemProfile guild={guild} user={user} member={member} />
        <Typography variant="h5" align="center" sx={{ fontFamily: 'Renner' }}>{level}</Typography>
        <Typography variant="h5" align="center" sx={{ fontFamily: 'Renner' }}>{experience}</Typography>
    </DesktopLevelItemRoot>
);

export interface LevelItemProps extends GuildViewProps {
    level: GuildLevel;
}

export const LevelItem = ({ guild, level, localization }: LevelItemProps) => (
    <LevelItemRoot>
        <MobileLevelItem guild={guild} level={level} localization={localization} />
        <DesktopLevelItem guild={guild} level={level} localization={localization} />
    </LevelItemRoot>
);

export interface LevelsProps extends GuildViewProps {
    levels: GuildLevel[];
}

export const Levels = ({ guild, levels, localization }: LevelsProps) => {
    const [items, setItems] = useState(levels.slice(0, 100));
    const count = items.length;

    const [loading, setLoading] = useState(false);
    const fetchedCountRef = useRef(-1);

    const handleRangeChange: WindowVirtualizerProps['onRangeChange'] = (_, end) => {
        if (end + 50 <= count || fetchedCountRef.current >= count || levels.length === count)
            return;

        fetchedCountRef.current = count;

        setLoading(true);
        setItems((prevItems) => [...prevItems, ...levels.slice(prevItems.length, prevItems.length + 100)]);
        setLoading(false);
    };

    useEffect(() => {
        fetchedCountRef.current = -1;
        setItems(levels.slice(0, 100));
        setLoading(false);
    }, [levels]);

    return (
        <Section sx={{ mt: { xs: -1, md: 0 }, p: 0 }}>
            <WindowVirtualizer onRangeChange={handleRangeChange}>
                {items.map((level) => (
                    <LevelItem
                        key={level.user.id}
                        guild={guild}
                        level={level}
                        localization={localization}
                    />
                ))}
                {loading && <LevelItemRoot>
                    <ItemRoot sx={{ justifyContent: 'center' }}>
                        <CircularProgress />
                    </ItemRoot>
                </LevelItemRoot>}
            </WindowVirtualizer>
        </Section>
    );
};
