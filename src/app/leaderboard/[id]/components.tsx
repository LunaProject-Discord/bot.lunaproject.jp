import { getMemberDisplay, getUserDisplay } from '@app/user';
import { ItemFormContainer, ItemIcon, ItemRoot, ItemRowContainer, ItemTextBlock } from '@components/items';
import { Code } from '@components/text';
import { GuildLevel } from '@interfaces/bot';
import { DataGuild, RedisGuild } from '@interfaces/redis';
import { GuildViewProps } from '@interfaces/view';
import { Avatar, Box, styled, Theme, Typography, useMediaQuery } from '@mui/material';
import { buildCdnUrl, getMemberAvatar, getUserAvatar } from '@utils/cdn';
import React, { Fragment } from 'react';

export const DesktopLevelItemRoot = styled(Box)(({ theme }) => ({
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

const ItemContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.shortest
    })
}));

const LevelItemRank = styled(Box)(({ theme }) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'flex',
    flexShrink: 0,
    placeItems: 'center',
    placeContent: 'center',
    fontFamily: 'Renner',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%'
}));

const LevelItemGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(1)
}));

interface LevelItemProps extends GuildViewProps {
    level: GuildLevel;
}

export const LevelItem = ({ guild, level, localization }: LevelItemProps) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));
    return isDesktop ? (
        <DesktopLevelItem guild={guild} level={level} localization={localization} />
    ) : (
        <MobileLevelItem guild={guild} level={level} localization={localization} />
    );
};

interface LevelItemProfileProps {
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
        <LevelItemRank>{rank}</LevelItemRank>
        <LevelItemProfile guild={guild} user={user} member={member} />
        <Typography variant="h5" align="center" sx={{ fontFamily: 'Renner' }}>{level}</Typography>
        <Typography variant="h5" align="center" sx={{ fontFamily: 'Renner' }}>{experience}</Typography>
    </DesktopLevelItemRoot>
);

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
    <ItemRoot>
        <ItemRowContainer>
            <LevelItemRank>{rank}</LevelItemRank>
            <LevelItemProfile guild={guild} user={user} member={member} />
        </ItemRowContainer>
        <ItemFormContainer sx={{ justifyContent: 'flex-start' }}>
            <LevelItemGroup>
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
    </ItemRoot>
);
