import { getMemberDisplay } from '@app/user';
import { GuildLevel } from '@interfaces/bot';
import { GuildViewProps } from '@interfaces/view';
import { Avatar, Box, CircularProgress, darken, Divider, lighten, Paper, Typography } from '@mui/material';
import { getMemberAvatar } from '@utils/cdn';
import { getMaxExperience } from '@utils/level';
import React from 'react';

export interface LevelCardProps extends GuildViewProps {
    level: Required<GuildLevel>;
}

export const LevelCard = (
    {
        level: {
            member,
            rank,
            level,
            experience
        },
        guild,
        localization: { translations }
    }: LevelCardProps
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
                gap: 3
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    あなたの情報
                </Typography>
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
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        value={100}
                        variant="determinate"
                        size={70}
                        thickness={2.4}
                        sx={(theme) => ({
                            color: theme.palette.mode === 'light' ? lighten(theme.palette.primary.main, .62) : darken(theme.palette.primary.main, .5)
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
                        <Typography component="div" variant="caption" color="text.secondary" lineHeight={1}>
                            {translations.level}
                        </Typography>
                        <Typography variant="h5" color="primary" fontFamily="Renner" lineHeight={1}>
                            {level}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                        <Typography variant="body2" color="text.secondary">
                            レベル {level} の経験値
                        </Typography>
                        <Typography sx={{ ml: 'auto' }}>
                            {maxExperience}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                        <Typography variant="body2" color="text.secondary">
                            現在の経験値
                        </Typography>
                        <Typography sx={{ ml: 'auto' }}>
                            {experience}
                        </Typography>
                    </Box>
                    <Divider flexItem />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                        <Typography variant="body2" color="text.secondary">
                            必要な残り経験値
                        </Typography>
                        <Typography sx={{ ml: 'auto' }}>
                            {maxExperience - experience}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};
