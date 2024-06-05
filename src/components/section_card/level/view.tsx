'use client';

import {
    sectionLevelCardClasses,
    SectionLevelCardProfile,
    SectionLevelCardRank,
    sectionLevelCardRootStyled,
    SectionLevelCardStatus
} from '@/components/section_card';
import { GuildLevel } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { merges, SectionCardProps, SectionCardRoot } from '@lunaproject/web-core/dist/components/SectionCard';
import { ConfigContext, generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import { styled } from '@mui/material';
import { BoxTypeMap } from '@mui/system';
import clsx from 'clsx';
import React, { ElementType, useContext } from 'react';

export const sectionLevelViewCardClasses = generateComponentClasses(
    'SectionLevelViewCard',
    [
        'root'
    ]
);

export const SectionLevelViewCardRoot = styled(
    ({ className, ...props }: SectionCardProps) => (
        <SectionCardRoot
            className={
                clsx(
                    sectionLevelCardClasses.root,
                    sectionLevelViewCardClasses.root,
                    className
                )
            }
            {...props}
        />
    )
)<SectionCardProps>(({ theme }) => sectionLevelCardRootStyled(theme));

export type SectionLevelViewCardRootProps = GuildLevel & GuildViewProps;

export type SectionLevelViewCardProps<C extends ElementType = BoxTypeMap['defaultComponent']> =
    Omit<SectionCardProps<C>, 'children'>
    & SectionLevelViewCardRootProps;

export const SectionLevelViewCard = (
    {
        user,
        member,
        guild,
        rank,
        level,
        experience,
        disabled,
        variant,
        slots: { display = {} } = {},
        slotProps: { display: displayProps = {} } = {},
        localization,
        ...props
    }: SectionLevelViewCardProps
) => {
    const { components } = useContext(ConfigContext);
    const {
        disabled: configDisabled,
        variant: configVariant,
        slots: { display: configDisplay = {} } = {},
        slotProps: { display: configDisplayProps = {} } = {}
    } = components?.SectionCard ?? {};

    return (
        <SectionLevelViewCardRoot disabled={disabled ?? configDisabled} variant={variant ?? configVariant} {...props}>
            <SectionLevelCardRank rank={rank} />
            <SectionLevelCardProfile
                user={user}
                member={member}
                guild={guild}
                slots={merges(configDisplay, display)}
                slotProps={merges(configDisplayProps, displayProps)}
            />
            <SectionLevelCardStatus level={level} experience={experience} localization={localization} />
        </SectionLevelViewCardRoot>
    );
};
