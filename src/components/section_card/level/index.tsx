'use client';

import { getProfileDisplay } from '@/app/user';
import { GuildLevel } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { DataGuild, RedisGuild } from '@/interfaces/redis';
import {
    SectionCardDisplayIcon,
    SectionCardDisplayPrimary,
    SectionCardDisplayRoot,
    SectionCardDisplaySecondary,
    SectionCardDisplaySlotsAndSlotProps,
    SlotRootProps
} from '@lunaproject/web-core/dist/components/SectionCard';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { SlotComponentProps } from '@mui/base';
import { Avatar, Box, BoxProps, CSSObject, styled, Theme, Typography, TypographyProps } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

export const sectionLevelCardClasses = generateComponentClasses(
    'SectionLevelCard',
    [
        'root',
        'profile',
        'rank',
        'status',
        'level',
        'experience'
    ]
);

export const sectionLevelCardRootStyled = (theme: Theme): CSSObject => ({
    display: 'grid',
    gridTemplateColumns: '32px 40px 1fr',
    gridTemplateRows: '1fr 1fr',
    [`& .${sectionLevelCardClasses.profile}`]: {
        gridColumn: '2 / span 2',
        gridRow: 1
    },
    [`& .${sectionLevelCardClasses.status}`]: {
        gridColumn: '1 / span 3',
        gridRow: 2,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'inherit'
    },
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '32px 40px 1fr 10% 10%',
        gridTemplateRows: '1fr',
        [`& .${sectionLevelCardClasses.profile}`]: {
            gridColumn: '2 / span 2',
            gridRow: 1
        },
        [`& .${sectionLevelCardClasses.status}`]: {
            gridColumn: '4 / span 2',
            gridRow: 1,
            display: 'grid',
            gridTemplateColumns: 'subgrid'
        }
    }
});

export const SectionLevelCardProfileRoot = ({ className, ...props }: BoxProps) => (
    <SectionCardDisplayRoot
        className={clsx(sectionLevelCardClasses.profile, className)}
        {...props}
    />
);

export interface SectionLevelCardProfileProps extends SectionCardDisplaySlotsAndSlotProps {
    user: GuildLevel['user'];
    member: GuildLevel['member'];
    guild: RedisGuild | DataGuild;
}

export const SectionLevelCardProfile = (
    {
        user,
        member,
        guild,
        slots: {
            root,
            icon,
            primary,
            secondary
        } = {},
        slotProps: {
            root: rootProps,
            icon: iconProps,
            primary: primaryProps,
            secondary: secondaryProps
        } = {}
    }: SectionLevelCardProfileProps
) => {
    const [avatar, primaryElement, secondaryElement] = getProfileDisplay(user, member, guild);

    return (
        <SectionLevelCardProfileRoot component={root} {...rootProps}>
            <SectionCardDisplayIcon component={icon} {...iconProps}>
                <Avatar src={avatar} alt=" " sx={{ pointerEvents: 'none' }} />
            </SectionCardDisplayIcon>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: .25 }}>
                <SectionCardDisplayPrimary component={primary} {...primaryProps}>
                    {primaryElement}
                </SectionCardDisplayPrimary>
                <SectionCardDisplaySecondary component={secondary} {...secondaryProps}>
                    {secondaryElement}
                </SectionCardDisplaySecondary>
            </Box>
        </SectionLevelCardProfileRoot>
    );
};

export const SectionLevelCardTypography = styled(Typography)({
    fontFamily: 'Renner, sans-serif'
});

export const SectionLevelCardRankRoot = styled(
    ({ className, ...props }: TypographyProps) => (
        <SectionLevelCardTypography
            component={Box}
            className={clsx(sectionLevelCardClasses.rank, className)}
            {...props}
        />
    )
)<TypographyProps>(({ theme }) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'flex',
    flexShrink: 0,
    placeItems: 'center',
    placeContent: 'center',
    color: theme.palette.common.white,
    borderRadius: '50%'
})) as typeof Box;

export interface SectionLevelCardRankProps extends Omit<BoxProps, 'children'> {
    rank: number;
}

export const SectionLevelCardRank = ({ rank, ...props }: SectionLevelCardRankProps) => {
    if (rank === 1) {
        return (
            <SectionLevelCardRankRoot sx={{ bgcolor: '#ffc006', fontSize: '1.25rem' }} {...props}>
                {rank}
            </SectionLevelCardRankRoot>
        );
    } else if (rank === 2) {
        return (
            <SectionLevelCardRankRoot sx={{ bgcolor: '#7fbfe2', fontSize: '1.25rem' }} {...props}>
                {rank}
            </SectionLevelCardRankRoot>
        );
    } else if (rank === 3) {
        return (
            <SectionLevelCardRankRoot sx={{ bgcolor: '#d18d52', fontSize: '1.25rem' }} {...props}>
                {rank}
            </SectionLevelCardRankRoot>
        );
    } else if (rank <= 10) {
        return (
            <SectionLevelCardRankRoot sx={{ bgcolor: 'primary.main' }} {...props}>
                {rank}
            </SectionLevelCardRankRoot>
        );
    }

    return (
        <SectionLevelCardRankRoot
            sx={{
                color: 'primary.main',
                bgcolor: 'transparent',
                border: (theme) => `solid 1px ${theme.palette.primary.main}`
            }}
            {...props}
        >
            {rank}
        </SectionLevelCardRankRoot>
    );
};

export const sectionLevelCardStatusItemClasses = generateComponentClasses(
    'SectionLevelCardStatusItem',
    [
        'root',
        'label',
        'content'
    ]
);

export const SectionLevelCardStatusItemRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionLevelCardStatusItemClasses.root, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    placeContent: 'center'
}));

export const SectionLevelCardStatusItemLabel = ({ className, sx, ...props }: TypographyProps) => (
    <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        className={clsx(sectionLevelCardStatusItemClasses.label, className)}
        sx={{ display: { xs: 'block', md: 'none' }, ...sx }}
        {...props}
    />
);

export const SectionLevelCardStatusItemContent = ({ className, ...props }: TypographyProps) => (
    <SectionLevelCardTypography
        variant="h5"
        align="center"
        className={clsx(sectionLevelCardStatusItemClasses.content, className)}
        {...props}
    />
);

export interface SectionLevelCardStatusItemRootProps extends Omit<BoxProps, 'children'>, LocalizationProps {
    slotProps?: {
        label?: SlotComponentProps<typeof Typography, SlotRootProps, {}>;
        content?: SlotComponentProps<typeof Typography, SlotRootProps, {}>;
    };
}

export interface SectionLevelCardLevelProps extends SectionLevelCardStatusItemRootProps {
    level: number;
}

export const SectionLevelCardLevel = (
    {
        level,
        slotProps: {
            label: labelProps,
            content: contentProps
        } = {},
        className,
        localization: { translations },
        ...props
    }: SectionLevelCardLevelProps
) => (
    <SectionLevelCardStatusItemRoot className={clsx(sectionLevelCardClasses.level, className)} {...props}>
        <SectionLevelCardStatusItemLabel {...labelProps}>{translations.level}</SectionLevelCardStatusItemLabel>
        <SectionLevelCardStatusItemContent {...contentProps}>{level}</SectionLevelCardStatusItemContent>
    </SectionLevelCardStatusItemRoot>
);

export interface SectionLevelCardExperienceProps extends SectionLevelCardStatusItemRootProps {
    experience: number;
}

export const SectionLevelCardExperience = (
    {
        experience,
        slotProps: {
            label: labelProps,
            content: contentProps
        } = {},
        className,
        localization: { translations },
        ...props
    }: SectionLevelCardExperienceProps
) => (
    <SectionLevelCardStatusItemRoot className={clsx(sectionLevelCardClasses.experience, className)} {...props}>
        <SectionLevelCardStatusItemLabel {...labelProps}>{translations.experience}</SectionLevelCardStatusItemLabel>
        <SectionLevelCardStatusItemContent {...contentProps}>{experience}</SectionLevelCardStatusItemContent>
    </SectionLevelCardStatusItemRoot>
);

export interface SectionLevelCardStatusProps extends Omit<BoxProps, 'children'>, LocalizationProps {
    level: number;
    experience: number;
    slotProps?: {
        level?: SlotComponentProps<typeof SectionLevelCardLevel, SlotRootProps, {}>;
        experience?: SlotComponentProps<typeof SectionLevelCardExperience, SlotRootProps, {}>;
    };
}

export const SectionLevelCardStatus = (
    {
        level,
        experience,
        slotProps: {
            level: levelProps,
            experience: experienceProps
        } = {},
        className,
        localization,
        ...props
    }: SectionLevelCardStatusProps
) => (
    <Box className={clsx(sectionLevelCardClasses.status, className)} {...props}>
        <SectionLevelCardLevel level={level} localization={localization} {...levelProps} />
        <SectionLevelCardExperience experience={experience} localization={localization} {...experienceProps} />
    </Box>
);

export * from './edit';
export * from './view';
