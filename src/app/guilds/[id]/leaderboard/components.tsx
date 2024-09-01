import { getMemberDisplay } from '@/app/user';
import { CheckIcon } from '@/components/icons';
import { GuildConfigurationLevelRewardRole, GuildConfigurationLevelRewardType, GuildLevel } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { getMemberAvatar } from '@/utils/cdn';
import { getRoleColor } from '@/utils/discord';
import { getMaxExperience } from '@/utils/level';
import { filterPredicateNonNullable } from '@lunaproject/web-core/dist/utils';
import {
    alpha,
    Avatar,
    Box,
    Chip,
    chipClasses,
    CircularProgress,
    darken,
    Divider,
    lighten,
    Paper,
    Typography
} from '@mui/material';
import groupBy from 'lodash/groupBy';
import { size } from 'polished';
import React from 'react';

export interface LevelProfileCardProps extends GuildViewProps {
    level: Required<GuildLevel>;
}

export const LevelProfileCard = (
    {
        level: {
            member,
            rank,
            level,
            experience
        },
        guild,
        localization: { translations }
    }: LevelProfileCardProps
) => {
    const maxExperience = getMaxExperience(level);

    const [primary, secondary] = getMemberDisplay(member);

    return (
        <Paper
            variant="outlined"
            elevation={0}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            <Typography variant="h6" fontWeight={400}>{translations.leaderboard_profile_card}</Typography>
            <Divider flexItem sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                    src={getMemberAvatar(member, guild)}
                    alt=" "
                    sx={{ pointerEvents: 'none' }}
                />
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden'
                    }}
                >
                    <Typography whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">{primary}</Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontFamily="Renner"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        overflow="hidden"
                    >
                        {secondary}
                    </Typography>
                </Box>
                <Typography variant="h5" color="primary" fontFamily="Renner">
                    #{rank}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        value={100}
                        variant="determinate"
                        size={70}
                        thickness={2.4}
                        sx={(theme) => ({
                            color: lighten(theme.palette.primary.main, .62),
                            ...theme.applyStyles('dark', {
                                color: darken(theme.palette.primary.main, .5)
                            })
                        })}
                    />
                    <CircularProgress
                        value={(experience / maxExperience) * 100}
                        variant="determinate"
                        color="primary"
                        size={70}
                        thickness={2.4}
                        sx={{
                            position: 'absolute',
                            inset: 0
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            placeItems: 'center',
                            placeContent: 'center',
                            gap: .5
                        }}
                    >
                        <Typography
                            component="div"
                            variant="caption"
                            color="text.secondary"
                            lineHeight={1}
                            sx={{ mt: .25 }}
                        >
                            {translations.level}
                        </Typography>
                        <Typography variant="h5" color="primary" fontFamily="Renner" lineHeight={1}>
                            {level}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            {String(translations.leaderboard_profile_card_total_experience).replace('%level', level.toString())}
                        </Typography>
                        <Typography>{maxExperience}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            {translations.leaderboard_profile_card_current_experience}
                        </Typography>
                        <Typography>{experience}</Typography>
                    </Box>
                    <Divider flexItem sx={{ my: .5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            {translations.leaderboard_profile_card_remaining_experience}
                        </Typography>
                        <Typography fontWeight={600}>{maxExperience - experience}</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

const isRewarded = (
    level: number | undefined,
    type: GuildConfigurationLevelRewardType,
    rewardLevel: number,
    nextRewardLevel: number
) => {
    if (!level)
        return false;

    if (type === 'STACK_PREVIOUS_ROLES')
        return level >= rewardLevel;

    return level >= rewardLevel && level < nextRewardLevel;
};

export interface LevelRewardsCardProps extends GuildViewProps {
    level: number | undefined;
    type: GuildConfigurationLevelRewardType;
    roles: GuildConfigurationLevelRewardRole[];
}

export const LevelRewardsCard = (
    {
        level,
        type,
        roles,
        guild,
        localization: { translations }
    }: LevelRewardsCardProps
) => {
    const roleGroups = groupBy(roles, 'level');
    const levels = Object.keys(roleGroups).map(Number).sort((a, b) => a - b);

    return (
        <Paper variant="outlined" elevation={0} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" fontWeight={400}>{translations.level_reward}</Typography>
            <Divider flexItem sx={{ mb: 1 }} />
            {Object.entries(roleGroups).map(([lv, roles], i) => (
                <Box key={lv} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">{translations.level} {lv}</Typography>
                        {isRewarded(
                            level,
                            type,
                            Number(lv),
                            levels[i + 1] ? levels[i + 1] : Number.MAX_SAFE_INTEGER
                        ) && <CheckIcon color="primary" />}
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .5 }}>
                        {roles
                            .map((role) => guild.roles.find((guildRole) => guildRole.id === role.id))
                            .filter(filterPredicateNonNullable)
                            .map((role) => (
                                <Chip
                                    key={role.id}
                                    icon={
                                        <Box
                                            sx={{
                                                ...size(24),
                                                display: 'flex',
                                                flexShrink: 0,
                                                placeItems: 'center',
                                                placeContent: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    ...size(12),
                                                    bgcolor: getRoleColor(role),
                                                    borderRadius: '50%'
                                                }}
                                            />
                                        </Box>
                                    }
                                    label={role.name}
                                    sx={(theme) => ({
                                        bgcolor: alpha(getRoleColor(role), .12),
                                        ...theme.applyStyles('dark', {
                                            bgcolor: alpha(getRoleColor(role), .24)
                                        }),
                                        [`& .${chipClasses.label}`]: {
                                            pl: 1
                                        }
                                    })}
                                />
                            ))
                        }
                    </Box>
                </Box>
            ))}
        </Paper>
    );
};
