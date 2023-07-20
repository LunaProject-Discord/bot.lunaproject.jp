import { getMemberDisplay } from '@app/user';
import { ItemFormContainer, ItemIcon, ItemRoot, ItemRowContainer, ItemTextBlock } from '@components/items';
import { GuildLevel } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { DataGuild, RedisMember } from '@interfaces/redis';
import { Avatar, Box, styled, Theme, Typography, useMediaQuery } from '@mui/material';
import { getMemberAvatar } from '@utils/cdn';
import React from 'react';

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

interface LevelItemProps extends LocalizationProps {
    guild: DataGuild;
    member: RedisMember;
    data: GuildLevel;
}

export const LevelItem = ({ guild, member, data, localization }: LevelItemProps) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));
    return isDesktop ? (
        <DesktopLevelItem guild={guild} member={member} data={data} localization={localization} />
    ) : (
        <MobileLevelItem guild={guild} member={member} data={data} localization={localization} />
    );
};

export const DesktopLevelItem = ({ guild, member, data, localization: { translations } }: LevelItemProps) => {
    const [primary, secondary] = getMemberDisplay(member);

    return (
        <DesktopLevelItemRoot sx={{ height: 50 }}>
            <LevelItemRank>
                {data.rank}
            </LevelItemRank>
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
            <Typography variant="h5" align="center" sx={{ fontFamily: 'Renner' }}>{data.level}</Typography>
            <Typography variant="h5" align="center" sx={{ fontFamily: 'Renner' }}>{data.xp}</Typography>
        </DesktopLevelItemRoot>
    );
};

export const MobileLevelItem = ({ guild, member, data, localization: { translations } }: LevelItemProps) => {
    const [primary, secondary] = getMemberDisplay(member);

    return (
        <ItemRoot>
            <ItemRowContainer>
                <LevelItemRank>
                    {data.rank}
                </LevelItemRank>
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
            </ItemRowContainer>
            <ItemFormContainer sx={{ justifyContent: 'flex-start' }}>
                <LevelItemGroup>
                    <Typography variant="body2" sx={{ flexShrink: 0 }}>{translations.level}</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'Renner' }}>{data.level}</Typography>
                </LevelItemGroup>
                <LevelItemGroup>
                    <Typography variant="body2" sx={{ flexShrink: 0 }}>{translations.experience}</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'Renner' }}>{data.xp}</Typography>
                </LevelItemGroup>
            </ItemFormContainer>
        </ItemRoot>
    );
};
